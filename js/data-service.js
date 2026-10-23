/**
 * Data Service - Quản lý nạp và chuẩn hóa dữ liệu thành ngữ
 * Hỗ trợ: Google Sheets CSV, Offline Fallback (seed_data.json), LocalStorage Cache.
 */

const SEED_DATA_URL = 'data/seed_data.json';
const CACHE_KEY = 'learn_chinese_idioms_data_v1';
const SHEET_CONFIG_KEY = 'learn_chinese_sheet_id';

class DataService {
  constructor() {
    this.data = null;
    this.dataSource = 'loading'; // 'google_sheets' | 'cache' | 'seed' | 'error'
    this.errorMsg = null;
  }

  /**
   * Khởi tạo nạp dữ liệu: Thử Sheet -> Cache -> Seed Data
   */
  async init() {
    const customSheetId = localStorage.getItem(SHEET_CONFIG_KEY);

    // 1. Nếu có cấu hình Sheet ID, thử tải từ Google Sheets
    if (customSheetId) {
      try {
        const sheetData = await this.fetchFromGoogleSheet(customSheetId);
        if (sheetData && sheetData.idioms && sheetData.idioms.length > 0) {
          this.data = sheetData;
          this.dataSource = 'google_sheets';
          this.saveToCache(sheetData);
          return this.data;
        }
      } catch (err) {
        console.warn('Lỗi nạp từ Google Sheets, chuyển sang nguồn dự phòng:', err);
      }
    }

    // 2. Thử nạp từ LocalStorage Cache nếu có
    const cached = this.loadFromCache();
    if (cached && cached.idioms && cached.idioms.length > 0) {
      this.data = cached;
      this.dataSource = 'cache';
      // Vẫn ngầm tải seed data để cập nhật phiên bản mới nhất nếu có
      this.refreshFromSeedInBackground();
      return this.data;
    }

    // 3. Nạp từ seed_data.json cục bộ
    try {
      const res = await fetch(SEED_DATA_URL);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const seedData = await res.json();
      this.data = seedData;
      this.dataSource = 'seed';
      this.saveToCache(seedData);
      return this.data;
    } catch (err) {
      console.error('Không thể nạp seed_data.json:', err);
      this.dataSource = 'error';
      this.errorMsg = err.message;
      throw err;
    }
  }

  async refreshFromSeedInBackground() {
    try {
      const res = await fetch(SEED_DATA_URL);
      if (res.ok) {
        const seedData = await res.json();
        this.saveToCache(seedData);
      }
    } catch (_) {}
  }

  saveToCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (e) {
      console.warn('Không thể lưu cache vào localStorage:', e);
    }
  }

  loadFromCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Cache có hiệu lực trong 24 giờ
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        return parsed.data;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  /**
   * Tải và phân tích dữ liệu CSV từ Google Sheets
   * Yêu cầu sheet được chia sẻ công khai "Ai có liên kết đều xem được"
   */
  async fetchFromGoogleSheet(sheetId) {
    const urlThanhNgu = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=ThanhNgu`;
    const res = await fetch(urlThanhNgu);
    if (!res.ok) throw new Error(`Không thể kết nối Sheet (${res.status})`);
    const csvText = await res.text();
    const rows = this.parseCSV(csvText);
    if (rows.length < 2) throw new Error('Dữ liệu Sheet rỗng hoặc sai định dạng');

    return this.transformSheetRowsToData(rows);
  }

  /**
   * Parser CSV chịu lỗi (xử lý dấu phẩy trong ngoặc kép)
   */
  parseCSV(text) {
    const lines = [];
    let row = [''];
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push('');
      } else if ((c === '\r' || c === '\n') && !inQuotes) {
        if (c === '\r' && next === '\n') i++;
        lines.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== '') {
      lines.push(row);
    }
    return lines;
  }

  /**
   * Chuyển đổi dòng CSV thành cấu trúc dữ liệu ứng dụng
   */
  transformSheetRowsToData(rows) {
    const headers = rows[0].map(h => h.trim().toLowerCase());
    const idioms = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx] ? row[idx].trim() : '';
      });

      // Bỏ qua nếu cột 'hien' là false/0 hoặc thiếu chữ Hán
      if (obj.hien === 'FALSE' || obj.hien === '0' || !obj.chu_han) continue;

      // Tách tự động mọi ký tự chữ Hán (không giới hạn 4 chữ)
      const cleanHanziList = Array.from(obj.chu_han.replace(/[\s,，、。]/g, ''));
      const pinyinList = (obj.pinyin_tung_chu ? obj.pinyin_tung_chu.split(/[,|;]+/) : (obj.pinyin ? obj.pinyin.split(/\s+/) : [])).map(s => s.trim());
      const hanvietList = (obj.hanviet_tung_chu ? obj.hanviet_tung_chu.split(/[,|;]+/) : (obj.han_viet ? obj.han_viet.split(/\s+/) : [])).map(s => s.trim());
      
      // Hỗ trợ cả 2 cách: Cột 'nghia_tung_chu' (ngăn cách bằng | hoặc ,) HOẶC cột riêng lẻ nghia_1, nghia_2...
      let meaningList = [];
      if (obj.nghia_tung_chu) {
        meaningList = obj.nghia_tung_chu.split(/[,|;]+/).map(s => s.trim());
      }

      const chars = cleanHanziList.map((c, cIdx) => {
        const p = obj[`pinyin_${cIdx + 1}`] || pinyinList[cIdx] || '';
        const hv = obj[`hanviet_${cIdx + 1}`] || hanvietList[cIdx] || '';
        const m = meaningList[cIdx] || obj[`nghia_${cIdx + 1}`] || '';
        return { c, p, hv, m };
      });

      const numStr = obj.so_lien_quan || obj.so_chinh || '1';
      const numbers = numStr.split(/[,;\s]+/).map(n => parseInt(n, 10)).filter(n => !isNaN(n));
      const primaryNumber = parseInt(obj.so_chinh, 10) || numbers[0] || 1;

      idioms.push({
        id: `idiom_${i}_${encodeURIComponent(obj.chu_han)}`,
        hanzi: obj.chu_han,
        pinyin: obj.pinyin || '',
        hanviet: obj.han_viet || '',
        numbers: numbers.length > 0 ? numbers : [primaryNumber],
        primaryNumber: primaryNumber,
        branchId: obj.nhanh_van_hoa || 'branch_default',
        chars: chars,
        literal: obj.nghia_den || '',
        meaning: obj.nghia_bong || '',
        culture: obj.van_hoa || '',
        quiz: {
          question: obj.cau_hoi || `Thành ngữ '${obj.chu_han}' có nghĩa là gì?`,
          options: [
            obj.dap_an_dung || obj.nghia_bong || 'Đúng',
            obj.sai_1 || 'Lựa chọn sai 1',
            obj.sai_2 || 'Lựa chọn sai 2',
            obj.sai_3 || 'Lựa chọn sai 3'
          ].filter(Boolean),
          answerIndex: 0
        }
      });
    }

    // Kết hợp với danh mục 5 số mặc định nếu sheet chỉ có tab Thành ngữ
    return {
      numbers: (this.data && this.data.numbers) ? this.data.numbers : [
        { number: 1, hanzi: "一", pinyin: "yī", hanviet: "Nhất", keyword: "Khởi nguyên & Toàn vẹn", branches: [] },
        { number: 3, hanzi: "三", pinyin: "sān", hanviet: "Tam", keyword: "Vững chãi & Đa số", branches: [] },
        { number: 8, hanzi: "八", pinyin: "bā", hanviet: "Bát", keyword: "Bát quái & Phát tài", branches: [] },
        { number: 9, hanzi: "九", pinyin: "jiǔ", hanviet: "Cửu", keyword: "Trường cửu & Đỉnh cao", branches: [] },
        { number: 10, hanzi: "十", pinyin: "shí", hanviet: "Thập", keyword: "Viên mãn & Trọn vẹn", branches: [] }
      ],
      idioms: idioms
    };
  }

  // --- Helper Methods ---

  getNumbers() {
    return (this.data && this.data.numbers) || [];
  }

  getNumberDetail(num) {
    const n = parseInt(num, 10);
    return this.getNumbers().find(item => item.number === n);
  }

  getIdiomsByNumber(num) {
    const n = parseInt(num, 10);
    if (!this.data || !this.data.idioms) return [];
    return this.data.idioms.filter(idiom => 
      idiom.primaryNumber === n || (idiom.numbers && idiom.numbers.includes(n))
    );
  }

  getIdiomById(id) {
    if (!this.data || !this.data.idioms) return null;
    return this.data.idioms.find(item => item.id === id);
  }

  getAllIdioms() {
    return (this.data && this.data.idioms) || [];
  }

  getDataSourceInfo() {
    return {
      source: this.dataSource,
      count: (this.data && this.data.idioms) ? this.data.idioms.length : 0,
      sheetId: localStorage.getItem(SHEET_CONFIG_KEY) || null
    };
  }

  setSheetId(sheetId) {
    if (!sheetId) {
      localStorage.removeItem(SHEET_CONFIG_KEY);
    } else {
      localStorage.setItem(SHEET_CONFIG_KEY, sheetId.trim());
    }
    localStorage.removeItem(CACHE_KEY); // Xóa cache cũ để nạp mới
  }
}

export const dataService = new DataService();
