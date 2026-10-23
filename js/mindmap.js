/**
 * Mindmap Engine - Vẽ sơ đồ tư duy bằng SVG tương tác thuần
 * Hỗ trợ chuyển đổi linh hoạt sang List View phân nhánh cho Mobile
 */

export class MindmapEngine {
  constructor(svgElement, listViewElement, onIdiomSelect) {
    this.svg = svgElement;
    this.listView = listViewElement;
    this.onIdiomSelect = onIdiomSelect;
    this.currentNumber = null;
    this.idioms = [];
    this.branches = [];
  }

  /**
   * Render dữ liệu sơ đồ tư duy cho một con số
   */
  render(numberObj, idioms) {
    this.currentNumber = numberObj;
    this.idioms = idioms;
    this.branches = (numberObj && numberObj.branches && numberObj.branches.length > 0)
      ? numberObj.branches
      : [
          { id: 'branch_1', name: 'Nhóm ý nghĩa 1', meaning: 'Ý niệm biểu trưng chính' },
          { id: 'branch_2', name: 'Nhóm ý nghĩa 2', meaning: 'Ý niệm biểu trưng phụ' },
          { id: 'branch_3', name: 'Nhóm ý nghĩa 3', meaning: 'Ý niệm mở rộng' }
        ];

    this.renderSVG();
    this.renderListView();
  }

  /**
   * Vẽ sơ đồ đồ họa bằng SVG Canvas
   */
  renderSVG() {
    this.svg.innerHTML = '';

    const width = 1060;

    // 1. Phân nhóm thành ngữ theo nhánh
    const branchIdiomsMap = {};
    this.branches.forEach((b) => {
      branchIdiomsMap[b.id] = [];
    });

    this.idioms.forEach((idiom, idx) => {
      if (idiom.branchId && branchIdiomsMap[idiom.branchId]) {
        branchIdiomsMap[idiom.branchId].push(idiom);
      } else {
        const targetBranch = this.branches[idx % this.branches.length];
        branchIdiomsMap[targetBranch.id].push(idiom);
      }
    });

    // 2. Tính toán layout tuần tự chống chồng đè (Anti-collision sequential layout)
    const leafHeight = 46;
    const leafGap = 16;
    const branchGroupGap = 36;
    let currentY = 50;

    const branchLayoutData = [];
    const idiomPositions = [];

    this.branches.forEach((branch, bIdx) => {
      const items = branchIdiomsMap[branch.id] || [];
      if (items.length === 0) return;

      const idiomYCoordinates = [];
      items.forEach((idiom) => {
        const y = currentY + leafHeight / 2;
        idiomYCoordinates.push(y);
        idiomPositions.push({
          idiom,
          x: 740,
          y: y,
          branchIdx: bIdx
        });
        currentY += leafHeight + leafGap;
      });

      // Tọa độ Y của nhánh là điểm chính giữa các thành ngữ con của nó
      const branchY = (idiomYCoordinates[0] + idiomYCoordinates[idiomYCoordinates.length - 1]) / 2;
      branchLayoutData.push({
        branch,
        bIdx,
        x: 430,
        y: branchY,
        count: items.length
      });

      currentY += branchGroupGap;
    });

    // Chiều cao tổng thể của SVG dựa trên nội dung thực tế
    const height = Math.max(620, currentY + 30);
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.style.height = `${height}px`;

    // Tọa độ Y trung tâm bằng trung bình của nhánh đầu và nhánh cuối
    const centerY = branchLayoutData.length > 0 
      ? (branchLayoutData[0].y + branchLayoutData[branchLayoutData.length - 1].y) / 2
      : height / 2;
    const centerX = 140;

    // 3. Render SVG elements
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.svg.appendChild(defs);

    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    edgesGroup.setAttribute('class', 'edges-group');
    this.svg.appendChild(edgesGroup);

    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodesGroup.setAttribute('class', 'nodes-group');
    this.svg.appendChild(nodesGroup);

    // Vẽ đường nối Trung tâm -> Nhánh và vẽ Node Nhánh
    const centerRadius = 48;
    const branchHalfWidth = 110;

    branchLayoutData.forEach((bData) => {
      const startX = centerX + centerRadius;
      const startY = centerY;
      const endX = bData.x - branchHalfWidth;
      const endY = bData.y;
      const midX = (startX + endX) / 2;

      const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
      edge.setAttribute('d', d);
      edge.setAttribute('class', 'mindmap-edge');
      edge.setAttribute('id', `edge-center-to-${bData.bIdx}`);
      edgesGroup.appendChild(edge);

      this.createBranchNode(nodesGroup, bData.branch, bData.x, bData.y, bData.bIdx, bData.count);
    });

    // Vẽ đường nối Nhánh -> Thành ngữ và vẽ Node Thành ngữ
    idiomPositions.forEach((iPos) => {
      const bData = branchLayoutData.find(b => b.bIdx === iPos.branchIdx);
      if (bData) {
        const startX = bData.x + branchHalfWidth;
        const startY = bData.y;
        const endX = iPos.x;
        const endY = iPos.y;
        const midX = (startX + endX) / 2;

        const idiomEdge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dIdiom = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
        idiomEdge.setAttribute('d', dIdiom);
        idiomEdge.setAttribute('class', 'mindmap-edge');
        idiomEdge.setAttribute('data-branch-edge', iPos.branchIdx);
        edgesGroup.appendChild(idiomEdge);
      }

      this.createIdiomNode(nodesGroup, iPos.idiom, iPos.x, iPos.y, iPos.branchIdx);
    });

    // Vẽ Node Trung Tâm (Con số)
    this.createCenterNode(nodesGroup, this.currentNumber, centerX, centerY);
  }

  /**
   * Tạo Node Trung tâm (Con số)
   */
  createCenterNode(container, numberObj, x, y) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x}, ${y})`);
    g.style.cursor = 'default';

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '48');
    circle.setAttribute('class', 'node-circle-center');

    const textHanzi = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textHanzi.setAttribute('text-anchor', 'middle');
    textHanzi.setAttribute('dy', '-2');
    textHanzi.setAttribute('fill', '#FFFFFF');
    textHanzi.setAttribute('font-family', 'var(--font-hanzi)');
    textHanzi.setAttribute('font-size', '34');
    textHanzi.setAttribute('font-weight', '700');
    textHanzi.textContent = numberObj.hanzi;

    const textSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textSub.setAttribute('text-anchor', 'middle');
    textSub.setAttribute('dy', '22');
    textSub.setAttribute('fill', 'rgba(255,255,255,0.9)');
    textSub.setAttribute('font-family', 'var(--font-sans)');
    textSub.setAttribute('font-size', '12');
    textSub.setAttribute('font-weight', '600');
    textSub.textContent = `${numberObj.hanviet || ''} (${numberObj.number})`;

    g.appendChild(circle);
    g.appendChild(textHanzi);
    g.appendChild(textSub);
    container.appendChild(g);
  }

  /**
   * Tạo Node Nhánh ý nghĩa văn hóa
   */
  createBranchNode(container, branch, x, y, bIdx, count) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x}, ${y})`);
    g.style.cursor = 'pointer';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '-110');
    rect.setAttribute('y', '-24');
    rect.setAttribute('width', '220');
    rect.setAttribute('height', '48');
    rect.setAttribute('rx', '10');
    rect.setAttribute('class', 'node-branch');

    const textTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textTitle.setAttribute('text-anchor', 'middle');
    textTitle.setAttribute('dy', '5');
    textTitle.setAttribute('fill', 'var(--text-main)');
    textTitle.setAttribute('font-family', 'var(--font-sans)');
    textTitle.setAttribute('font-size', '13');
    textTitle.setAttribute('font-weight', '700');
    textTitle.textContent = `${branch.name} (${count})`;

    g.appendChild(rect);
    g.appendChild(textTitle);

    // Hover highlight
    g.addEventListener('mouseenter', () => {
      document.querySelectorAll(`[data-branch-edge="${bIdx}"]`).forEach(el => el.classList.add('highlight'));
      const centerEdge = document.getElementById(`edge-center-to-${bIdx}`);
      if (centerEdge) centerEdge.classList.add('highlight');
    });

    g.addEventListener('mouseleave', () => {
      document.querySelectorAll(`[data-branch-edge="${bIdx}"]`).forEach(el => el.classList.remove('highlight'));
      const centerEdge = document.getElementById(`edge-center-to-${bIdx}`);
      if (centerEdge) centerEdge.classList.remove('highlight');
    });

    container.appendChild(g);
  }

  /**
   * Tạo Node Thành Ngữ Lá (Leaf) - 2 dòng thanh lịch, không đè chữ
   */
  createIdiomNode(container, idiom, x, y, bIdx) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${x}, ${y})`);
    g.setAttribute('class', 'leaf-idiom-node');
    g.style.cursor = 'pointer';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '-22');
    rect.setAttribute('width', '260');
    rect.setAttribute('height', '44');
    rect.setAttribute('rx', '8');
    rect.setAttribute('class', 'node-idiom');

    // Dòng 1: Chữ Hán to rõ ràng
    const textHanzi = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textHanzi.setAttribute('x', '16');
    textHanzi.setAttribute('y', '-4');
    textHanzi.setAttribute('fill', 'var(--text-main)');
    textHanzi.setAttribute('font-family', 'var(--font-hanzi)');
    textHanzi.setAttribute('font-size', '15');
    textHanzi.setAttribute('font-weight', '700');
    textHanzi.textContent = idiom.hanzi;

    // Dòng 2: Pinyin + Hán Việt
    const textSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textSub.setAttribute('x', '16');
    textSub.setAttribute('y', '13');
    textSub.setAttribute('fill', 'var(--text-muted)');
    textSub.setAttribute('font-family', 'var(--font-sans)');
    textSub.setAttribute('font-size', '11');

    const spanPinyin = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    spanPinyin.setAttribute('fill', 'var(--c-cinnabar)');
    spanPinyin.setAttribute('font-weight', '600');
    spanPinyin.textContent = idiom.pinyin || '';
    textSub.appendChild(spanPinyin);

    if (idiom.hanviet) {
      const spanHv = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      spanHv.setAttribute('class', 'num-hanviet');
      spanHv.setAttribute('dx', '8');
      spanHv.textContent = `• ${idiom.hanviet}`;
      textSub.appendChild(spanHv);
    }

    g.appendChild(rect);
    g.appendChild(textHanzi);
    g.appendChild(textSub);

    g.addEventListener('click', () => {
      if (this.onIdiomSelect) {
        this.onIdiomSelect(idiom);
      }
    });

    container.appendChild(g);
  }

  /**
   * Render Chế độ Danh sách (Cực kỳ thân thiện cho Mobile & Tablet)
   */
  renderListView() {
    this.listView.innerHTML = '';

    const branchIdiomsMap = {};
    this.branches.forEach(b => { branchIdiomsMap[b.id] = []; });
    this.idioms.forEach((idiom, idx) => {
      if (idiom.branchId && branchIdiomsMap[idiom.branchId]) {
        branchIdiomsMap[idiom.branchId].push(idiom);
      } else {
        const targetBranch = this.branches[idx % this.branches.length];
        branchIdiomsMap[targetBranch.id].push(idiom);
      }
    });

    this.branches.forEach(branch => {
      const items = branchIdiomsMap[branch.id] || [];
      if (items.length === 0) return;

      const groupEl = document.createElement('div');
      groupEl.className = 'branch-group';
      groupEl.innerHTML = `
        <div class="branch-header">
          <span>🌿</span>
          <span>${branch.name}</span>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">(${items.length} thành ngữ)</span>
        </div>
        <p class="branch-desc">${branch.meaning || ''}</p>
        <div class="branch-idioms-grid">
          ${items.map(idiom => `
            <div class="idiom-tile" data-idiom-id="${idiom.id}">
              <div>
                <div class="tile-hanzi">${idiom.hanzi}</div>
                <div class="tile-pinyin">${idiom.pinyin}</div>
                <div class="tile-hanviet">${idiom.hanviet}</div>
              </div>
              <span class="action-arrow">➔</span>
            </div>
          `).join('')}
        </div>
      `;

      groupEl.querySelectorAll('.idiom-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          const id = tile.getAttribute('data-idiom-id');
          const found = this.idioms.find(i => i.id === id);
          if (found && this.onIdiomSelect) {
            this.onIdiomSelect(found);
          }
        });
      });

      this.listView.appendChild(groupEl);
    });
  }
}
