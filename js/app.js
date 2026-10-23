/**
 * Main Application Orchestrator
 */

import { dataService } from './data-service.js';
import { MindmapEngine } from './mindmap.js';
import { DetailModal } from './detail-modal.js';

class App {
  constructor() {
    this.currentNumber = 9; // Mặc định mở số 9 (Cửu) giàu ý nghĩa văn hóa nhất
    this.currentView = 'mindmap'; // 'mindmap' | 'list'
    this.mindmapEngine = null;
    this.detailModal = null;
  }

  async init() {
    this.initPreferences();
    this.detailModal = new DetailModal();

    const svgEl = document.getElementById('mindmap-svg');
    const listEl = document.getElementById('idiom-list-view');
    this.mindmapEngine = new MindmapEngine(svgEl, listEl, (idiom) => {
      this.detailModal.open(idiom);
    });

    this.initHeaderControls();
    this.initViewSwitcher();
    this.initSheetSettingsModal();

    try {
      await dataService.init();
      this.updateStatusBadge();
      this.renderNumberGrid();
      this.selectNumber(this.currentNumber);
    } catch (err) {
      console.error('Lỗi khởi tạo ứng dụng:', err);
      const statusText = document.getElementById('data-status-text');
      if (statusText) statusText.textContent = 'Lỗi nạp dữ liệu: ' + err.message;
    }
  }

  /**
   * Khởi tạo cài đặt giao diện (Theme & Hán Việt)
   */
  initPreferences() {
    // 1. Âm Hán Việt (Mặc định: BẬT theo Q4)
    const savedHv = localStorage.getItem('learn_chinese_show_hanviet');
    const showHanviet = savedHv === null ? true : savedHv === 'true';
    const hvToggle = document.getElementById('toggle-hanviet');
    if (hvToggle) {
      hvToggle.checked = showHanviet;
    }
    this.applyHanvietVisibility(showHanviet);

    // 2. Theme Sáng / Tối
    const savedTheme = localStorage.getItem('learn_chinese_theme') || 'light';
    this.applyTheme(savedTheme);
  }

  applyHanvietVisibility(show) {
    if (show) {
      document.body.classList.remove('hide-hanviet');
    } else {
      document.body.classList.add('hide-hanviet');
    }
    localStorage.setItem('learn_chinese_show_hanviet', show);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('learn_chinese_theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  initHeaderControls() {
    // Toggle Hán Việt
    const hvToggle = document.getElementById('toggle-hanviet');
    if (hvToggle) {
      hvToggle.addEventListener('change', (e) => {
        this.applyHanvietVisibility(e.target.checked);
      });
    }

    // Toggle Theme Sáng / Tối
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.applyTheme(next);
      });
    }

    // Brand click -> scroll top
    const brandHome = document.getElementById('brand-home');
    if (brandHome) {
      brandHome.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  initViewSwitcher() {
    const btnMindmap = document.getElementById('btn-view-mindmap');
    const btnList = document.getElementById('btn-view-list');
    const canvasContainer = document.getElementById('mindmap-canvas-container');
    const listContainer = document.getElementById('idiom-list-view');

    if (btnMindmap && btnList) {
      btnMindmap.addEventListener('click', () => {
        btnMindmap.classList.add('active');
        btnList.classList.remove('active');
        canvasContainer.style.display = 'flex';
        listContainer.classList.remove('active');
        this.currentView = 'mindmap';
      });

      btnList.addEventListener('click', () => {
        btnList.classList.add('active');
        btnMindmap.classList.remove('active');
        canvasContainer.style.display = 'none';
        listContainer.classList.add('active');
        this.currentView = 'list';
      });
    }
  }

  updateStatusBadge() {
    const info = dataService.getDataSourceInfo();
    const statusText = document.getElementById('data-status-text');
    if (!statusText) return;

    if (info.source === 'google_sheets') {
      statusText.textContent = `Google Sheets đã kết nối (${info.count} thành ngữ)`;
    } else if (info.source === 'cache') {
      statusText.textContent = `Đang dùng bản cache cục bộ (${info.count} thành ngữ)`;
    } else {
      statusText.textContent = `Đang dùng dữ liệu sẵn có (${info.count} thành ngữ)`;
    }
  }

  /**
   * Render 5 ô chọn con số ở Trang chủ
   */
  renderNumberGrid() {
    const grid = document.getElementById('number-grid');
    if (!grid) return;

    const numbers = dataService.getNumbers();
    grid.innerHTML = '';

    numbers.forEach((numObj) => {
      const idioms = dataService.getIdiomsByNumber(numObj.number);
      const card = document.createElement('div');
      card.className = `number-card ${numObj.number === this.currentNumber ? 'active' : ''}`;
      card.setAttribute('data-hanzi', numObj.hanzi);
      card.setAttribute('data-number', numObj.number);

      card.innerHTML = `
        <div class="card-top">
          <div class="num-hanzi-badge">${numObj.hanzi}</div>
          <div class="num-meta">
            <div class="num-pinyin">${numObj.pinyin || ''}</div>
            <div class="num-hanviet">${numObj.hanviet || ''}</div>
          </div>
        </div>
        <div class="card-mid">
          <div class="num-keyword">${numObj.keyword || 'Ý nghĩa biểu trưng'}</div>
          <div class="num-snippet">${numObj.cultureOverview || ''}</div>
        </div>
        <div class="card-bottom">
          <span class="count-pill">${idioms.length} thành ngữ</span>
          <span class="action-arrow">Khám phá ➔</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.selectNumber(numObj.number);
      });

      grid.appendChild(card);
    });
  }

  /**
   * Chọn số và nạp dữ liệu vào Mindmap Panel
   */
  selectNumber(num) {
    this.currentNumber = num;

    // Cập nhật trạng thái active trên card
    document.querySelectorAll('.number-card').forEach(card => {
      const cardNum = parseInt(card.getAttribute('data-number'), 10);
      if (cardNum === num) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    const numObj = dataService.getNumberDetail(num);
    const idioms = dataService.getIdiomsByNumber(num);

    // Cập nhật tiêu đề Mindmap Panel
    const sealEl = document.getElementById('active-num-seal');
    const nameEl = document.getElementById('active-num-name');
    const cultureEl = document.getElementById('active-num-culture');

    if (numObj) {
      if (sealEl) sealEl.textContent = numObj.hanzi;
      if (nameEl) nameEl.textContent = `Số ${numObj.number} — ${numObj.hanviet || ''} (${numObj.pinyin || ''}) • ${numObj.keyword || ''}`;
      if (cultureEl) cultureEl.textContent = numObj.cultureOverview || '';
    }

    // Vẽ lại Mindmap & List view
    this.mindmapEngine.render(numObj, idioms);

    // Cuộn nhẹ tới panel nếu người dùng click chọn trên mobile
    if (window.innerWidth < 768) {
      const panel = document.getElementById('mindmap-panel');
      if (panel) {
        const top = panel.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  /**
   * Xử lý Modal cấu hình Google Sheets
   */
  initSheetSettingsModal() {
    const btnOpen = document.getElementById('btn-sheet-settings');
    const modal = document.getElementById('sheet-modal');
    const btnClose = document.getElementById('btn-close-sheet-modal');
    const inputSheet = document.getElementById('input-sheet-id');
    const btnSave = document.getElementById('btn-save-sheet');
    const btnReset = document.getElementById('btn-reset-sheet');

    if (btnOpen && modal) {
      btnOpen.addEventListener('click', () => {
        const currentId = localStorage.getItem('learn_chinese_sheet_id') || '';
        if (inputSheet) inputSheet.value = currentId;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
      });

      if (btnClose) {
        btnClose.addEventListener('click', () => {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      });

      if (btnSave) {
        btnSave.addEventListener('click', async () => {
          const val = inputSheet.value.trim();
          dataService.setSheetId(val);
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          const statusText = document.getElementById('data-status-text');
          if (statusText) statusText.textContent = 'Đang tải lại dữ liệu...';
          await dataService.init();
          this.updateStatusBadge();
          this.renderNumberGrid();
          this.selectNumber(this.currentNumber);
        });
      }

      if (btnReset) {
        btnReset.addEventListener('click', async () => {
          dataService.setSheetId('');
          if (inputSheet) inputSheet.value = '';
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          await dataService.init();
          this.updateStatusBadge();
          this.renderNumberGrid();
          this.selectNumber(this.currentNumber);
        });
      }
    }
  }
}

// Khởi chạy ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
