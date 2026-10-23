/**
 * Detail Modal / Bottom Sheet - Hiển thị bóc tách chi tiết thành ngữ
 */

export class DetailModal {
  constructor() {
    this.modal = document.getElementById('idiom-modal');
    this.closeBtn = document.getElementById('btn-close-modal');
    this.hanziEl = document.getElementById('modal-hanzi');
    this.pinyinEl = document.getElementById('modal-pinyin');
    this.hanvietEl = document.getElementById('modal-hanviet');
    this.charsGrid = document.getElementById('modal-chars-grid');
    this.literalEl = document.getElementById('modal-literal');
    this.meaningEl = document.getElementById('modal-meaning');
    this.cultureEl = document.getElementById('modal-culture');

    this.initEvents();
  }

  initEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('open');
  }

  open(idiom) {
    if (!idiom || !this.modal) return;

    this.hanziEl.textContent = idiom.hanzi;
    this.pinyinEl.textContent = idiom.pinyin;
    this.hanvietEl.textContent = idiom.hanviet || '';

    // Render 4 ô bóc tách chữ Hán
    this.charsGrid.innerHTML = '';
    const chars = idiom.chars || [];
    chars.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'char-card';
      card.innerHTML = `
        <div class="char-hanzi">${c.c}</div>
        <div class="char-pinyin">${c.p || ''}</div>
        <div class="char-hanviet">${c.hv || ''}</div>
        <div class="char-meaning">${c.m || ''}</div>
      `;
      this.charsGrid.appendChild(card);
    });

    this.literalEl.textContent = idiom.literal || 'Đang cập nhật...';
    this.meaningEl.textContent = idiom.meaning || 'Đang cập nhật...';
    this.cultureEl.textContent = idiom.culture || 'Đang cập nhật...';

    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Khóa cuộn trang nền
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('open');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
