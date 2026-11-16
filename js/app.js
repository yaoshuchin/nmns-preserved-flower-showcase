/**
 * 南投國中數學領域教師研習 ‧ 永生花跨領域手作特展
 * 《當數學遇見永生花：幾何與植物科學的璀璨交織》
 * 核心應用邏輯與互動引擎 (Core Application Controller)
 */

document.addEventListener('DOMContentLoaded', () => {
  initFontController();
  initThemeController();
  initMusicController();
  initTabNavigation();
  initGallery();
  initFaqAccordion();
  initSlideDeck();
  initCanvasWhiteboard();
  initQrSharing();
});

/* ==========================================================================
   1. 根字級全局動態縮放 (Root Font Size Controller)
   ========================================================================== */
function initFontController() {
  const fontBtns = document.querySelectorAll('.font-btn');
  const savedFont = localStorage.getItem('nmns_flower_font') || 'normal';

  applyFontSize(savedFont);

  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.font;
      applyFontSize(size);
      localStorage.setItem('nmns_flower_font', size);
    });
  });

  function applyFontSize(size) {
    document.documentElement.setAttribute('data-font', size);
    fontBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.font === size);
    });
  }
}

/* ==========================================================================
   2. 四色情境色彩主題切換 (Theme Switching Controller)
   ========================================================================== */
function initThemeController() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  // 預設為自然植感推薦之綠色系 (green)
  const savedTheme = localStorage.getItem('nmns_flower_theme') || 'green';

  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      applyTheme(theme);
      localStorage.setItem('nmns_flower_theme', theme);
    });
  });

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    themeBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }
}

/* ==========================================================================
   3. 原生 Web Audio 水晶音樂合成器整合 (Crystal Music Controller)
   ========================================================================== */
let musicEngine = null;

function initMusicController() {
  const playBtn = document.getElementById('musicPlayBtn');
  const trackBtn = document.getElementById('musicNextBtn');
  const muteBtn = document.getElementById('musicMuteBtn');
  const trackNameEl = document.getElementById('musicTrackName');

  if (typeof CrystalMusicEngine !== 'undefined') {
    musicEngine = new CrystalMusicEngine();
    // 客製化曲目名稱為永生花展覽主題
    musicEngine.tracks = [
      {
        name: '綠意晨曦 (C大調悠揚)',
        scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25],
        tempoMs: 380,
        pattern: [0, 2, 4, 7, 5, 4, 2, 0, 4, 5, 7, 4, 2, 1, 0, 2]
      },
      {
        name: '幾何之舞 (G大調輕快)',
        scale: [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00],
        tempoMs: 300,
        pattern: [0, 1, 2, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 0, 1, 0]
      },
      {
        name: '永恆之花 (F大調溫暖)',
        scale: [349.23, 392.00, 440.00, 466.16, 523.25, 587.33, 698.46],
        tempoMs: 440,
        pattern: [0, 2, 4, 3, 2, 0, 1, 3, 2, 4, 6, 4, 2, 0, 1, 0]
      },
      {
        name: '自然冥想 (A小調沉靜)',
        scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
        tempoMs: 500,
        pattern: [0, 2, 3, 5, 4, 3, 2, 0, 1, 2, 4, 2, 1, 0, 2, 0]
      }
    ];
  }

  function updateMusicUI() {
    if (!musicEngine) return;
    trackNameEl.textContent = musicEngine.tracks[musicEngine.currentTrack].name.split(' ')[0];
    playBtn.textContent = musicEngine.isPlaying ? '⏸' : '▶';
    muteBtn.textContent = musicEngine.isMuted ? '🔇' : '🔊';
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!musicEngine) return;
      if (musicEngine.isPlaying) {
        musicEngine.stop();
      } else {
        musicEngine.start();
      }
      updateMusicUI();
    });
  }

  if (trackBtn) {
    trackBtn.addEventListener('click', () => {
      if (!musicEngine) return;
      const next = (musicEngine.currentTrack + 1) % musicEngine.tracks.length;
      musicEngine.switchTrack(next);
      updateMusicUI();
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (!musicEngine) return;
      musicEngine.toggleMute();
      updateMusicUI();
    });
  }

  updateMusicUI();
}

/* ==========================================================================
   4. 五大核心導航分頁 (Tab Navigation Controller)
   ========================================================================== */
function initTabNavigation() {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      switchTab(targetId);
    });
  });

  // 全域雙向跳轉：支援點選卡片或按鈕直達簡報對應頁
  document.addEventListener('click', (e) => {
    const jumpBtn = e.target.closest('[data-slide]');
    if (jumpBtn) {
      e.preventDefault();
      const slideNum = parseInt(jumpBtn.dataset.slide, 10);
      switchTab('tab-deck');
      if (window.goToSlide) {
        window.goToSlide(slideNum);
      }
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  });
}

function switchTab(tabId) {
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const panes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  panes.forEach(p => {
    p.classList.toggle('active', p.id === tabId);
  });
}

/* ==========================================================================
   5. 🌟 成果展示相簿與燈箱 (Gallery & Lightbox Controller)
   ========================================================================== */
function initGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!galleryGrid || !window.GALLERY_DATA) return;

  function renderGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    const filtered = filter === 'all'
      ? window.GALLERY_DATA
      : window.GALLERY_DATA.filter(item => item.category === filter);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${item.thumb}" alt="${item.title}" loading="lazy" onerror="this.src='${item.image}'">
          <span class="gallery-category-badge">${item.category_name}</span>
          <span class="gallery-aspect-tag">${item.aspect}</span>
        </div>
        <div class="gallery-caption">
          <h4 class="gallery-title">${item.title}</h4>
          <p class="gallery-desc">${item.desc}</p>
          <div class="gallery-meta">
            <div class="gallery-tags">
              ${item.tags.map(t => `<span class="gallery-tag-pill">#${t}</span>`).join('')}
            </div>
            <a href="#" class="gallery-slide-link" data-slide="${item.slide_link}">大綱 P.${item.slide_link} ➔</a>
          </div>
        </div>
      `;

      // 點選圖片打開高解析燈箱
      card.querySelector('.gallery-img-wrapper').addEventListener('click', () => {
        openLightbox(item.image, `${item.title} —— ${item.desc}`);
      });

      galleryGrid.appendChild(card);
    });
  }

  // 篩選標籤點擊
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });

  renderGallery('all');

  function openLightbox(src, text) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxCaption.textContent = text;
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  window.openShowcaseLightbox = openLightbox;
}

/* ==========================================================================
   6. 🎯 科普與問答手風琴 (FAQ Accordion Controller)
   ========================================================================== */
function initFaqAccordion() {
  const faqCards = document.querySelectorAll('.faq-card');

  faqCards.forEach(card => {
    const header = card.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      // 手風琴平滑切換
      faqCards.forEach(c => c.classList.remove('open'));
      if (!isOpen) {
        card.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   7. 📽️ 15 頁永生花簡報模式 (Slide Presentation Deck Controller)
   ========================================================================== */
let currentSlideIndex = 0;
let autoPlayTimer = null;

function initSlideDeck() {
  const slides = window.SLIDES_DATA || [];
  if (!slides.length) return;

  const stageImg = document.getElementById('slideStageImg');
  const stageBadge = document.getElementById('slideStageBadge');
  const slideMathPill = document.getElementById('slideMathPill');
  const slideTitle = document.getElementById('slideTitle');
  const slideSubtitle = document.getElementById('slideSubtitle');
  const slideSummary = document.getElementById('slideSummary');
  const slideBullets = document.getElementById('slideBullets');
  const slideQuiz = document.getElementById('slideQuiz');
  const slideIndicator = document.getElementById('slideIndicator');
  const notesPanel = document.getElementById('speakerNotesPanel');

  const prevBtn = document.getElementById('deckPrevBtn');
  const nextBtn = document.getElementById('deckNextBtn');
  const autoPlayBtn = document.getElementById('deckAutoPlayBtn');
  const notesToggleBtn = document.getElementById('deckNotesToggleBtn');
  const fullscreenBtn = document.getElementById('deckFullscreenBtn');
  const thumbsDrawer = document.getElementById('thumbsDrawer');

  // 生成底部縮圖列
  if (thumbsDrawer) {
    thumbsDrawer.innerHTML = '';
    slides.forEach((s, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-card ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `
        <img src="${s.image}" alt="P.${s.slide_num}">
        <span class="thumb-num">P.${s.slide_num}</span>
      `;
      thumb.addEventListener('click', () => {
        renderSlide(idx);
      });
      thumbsDrawer.appendChild(thumb);
    });
  }

  function renderSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentSlideIndex = index;
    const s = slides[index];

    if (stageImg) stageImg.src = s.image;
    if (stageBadge) stageBadge.textContent = `${s.category} ‧ ${s.badge}`;
    if (slideMathPill) slideMathPill.textContent = s.math_badge;
    if (slideTitle) slideTitle.textContent = s.title;
    if (slideSubtitle) slideSubtitle.textContent = s.subtitle;
    if (slideSummary) slideSummary.textContent = s.summary;

    if (slideBullets) {
      slideBullets.innerHTML = s.key_points.map(pt => `
        <li class="slide-bullet-item">${pt}</li>
      `).join('');
    }

    if (slideQuiz) {
      slideQuiz.innerHTML = `<strong>💡 課程互動思考：</strong>${s.quiz}`;
    }

    if (slideIndicator) {
      slideIndicator.textContent = `投影片 ${s.slide_num} / ${slides.length}`;
    }

    if (notesPanel) {
      notesPanel.innerHTML = `<strong>🎙️ 講者備忘錄：</strong> ${s.notes}`;
    }

    // 同步縮圖抽屜
    if (thumbsDrawer) {
      const thumbCards = thumbsDrawer.querySelectorAll('.thumb-card');
      thumbCards.forEach((tc, i) => {
        tc.classList.toggle('active', i === index);
      });
      // 自動滾動使選中縮圖置中
      const activeThumb = thumbCards[index];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }

    // 切換頁面時自動清除 Canvas 舊筆跡
    if (window.clearDrawingCanvas) {
      window.clearDrawingCanvas();
    }
  }

  window.goToSlide = function(num) {
    const idx = num - 1;
    if (idx >= 0 && idx < slides.length) {
      renderSlide(idx);
    }
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => renderSlide(currentSlideIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => renderSlide(currentSlideIndex + 1));
  }

  // 自動播放
  if (autoPlayBtn) {
    autoPlayBtn.addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        autoPlayBtn.classList.remove('active');
        autoPlayBtn.innerHTML = '▶ 自動輪播';
      } else {
        autoPlayBtn.classList.add('active');
        autoPlayBtn.innerHTML = '⏸ 停止輪播';
        autoPlayTimer = setInterval(() => {
          renderSlide(currentSlideIndex + 1);
        }, 6000);
      }
    });
  }

  // 大綱目錄抽屜切換
  const syllabusToggleBtn = document.getElementById('deckSyllabusToggleBtn');
  const syllabusDrawer = document.getElementById('syllabusDrawer');
  if (syllabusToggleBtn && syllabusDrawer) {
    syllabusToggleBtn.addEventListener('click', () => {
      const isHidden = syllabusDrawer.style.display === 'none' || syllabusDrawer.style.display === '';
      syllabusDrawer.style.display = isHidden ? 'block' : 'none';
      syllabusToggleBtn.classList.toggle('active', isHidden);
    });
  }

  // 講者備忘錄切換
  if (notesToggleBtn && notesPanel) {
    notesToggleBtn.addEventListener('click', () => {
      notesPanel.classList.toggle('open');
      notesToggleBtn.classList.toggle('active');
    });
  }

  // 全螢幕切換
  if (fullscreenBtn) {
    const wrapper = document.getElementById('slideStageWrapper');
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (wrapper.requestFullscreen) wrapper.requestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }

  // 鍵盤導覽
  document.addEventListener('keydown', (e) => {
    // 若在輸入框內則不攔截
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      renderSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      renderSlide(currentSlideIndex - 1);
    } else if (e.key === 'n' || e.key === 'N') {
      if (notesPanel) notesPanel.classList.toggle('open');
    }
  });

  renderSlide(0);
}

/* ==========================================================================
   8. 全螢幕 Canvas 白板與極致微型畫筆工具列 (Compact Toolbar & Drawing)
   ========================================================================== */
function initCanvasWhiteboard() {
  const canvas = document.getElementById('slideCanvas');
  const toolbar = document.getElementById('dockedToolbar');
  const penWakeBtn = document.getElementById('penWakeBtn');
  const closeToolbarBtn = document.getElementById('closeToolbarBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentTool = 'pen'; // pen, highlighter, line, arrow, rect, circle, eraser
  let currentColor = '#ff3b30'; // 紅色預設
  let currentSize = 3;
  let undoStack = [];

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    // 儲存目前畫布內容
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 300);

  function saveState() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 25) undoStack.shift();
  }

  function undo() {
    if (undoStack.length > 0) {
      const state = undoStack.pop();
      ctx.putImageData(state, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  window.clearDrawingCanvas = function() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undoStack = [];
  };

  // 工具列按鈕事件
  const toolBtns = document.querySelectorAll('.mini-tool-btn[data-tool]');
  toolBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTool = btn.dataset.tool;
      canvas.classList.add('drawing-enabled');
    });
  });

  // 調色盤點擊
  const colorDots = document.querySelectorAll('.color-dot');
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      currentColor = dot.dataset.color;
    });
  });

  // 筆粗細切換
  const sizeBtns = document.querySelectorAll('.mini-tool-btn[data-size]');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSize = parseInt(btn.dataset.size, 10);
    });
  });

  // 復原與清空
  const undoBtn = document.getElementById('drawUndoBtn');
  const clearBtn = document.getElementById('drawClearBtn');
  if (undoBtn) undoBtn.addEventListener('click', undo);
  if (clearBtn) clearBtn.addEventListener('click', window.clearDrawingCanvas);

  // 實體關閉按鈕
  if (closeToolbarBtn) {
    closeToolbarBtn.addEventListener('click', () => {
      toolbar.classList.add('hidden');
      penWakeBtn.classList.add('show');
      canvas.classList.remove('drawing-enabled');
    });
  }

  // 喚醒畫筆按鈕
  if (penWakeBtn) {
    penWakeBtn.addEventListener('click', () => {
      toolbar.classList.remove('hidden');
      penWakeBtn.classList.remove('show');
      canvas.classList.add('drawing-enabled');
    });
  }

  // 鍵盤快捷鍵：Esc / D / P 開關畫筆
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'Escape' || e.key === 'd' || e.key === 'D' || e.key === 'p' || e.key === 'P') {
      if (toolbar.classList.contains('hidden')) {
        toolbar.classList.remove('hidden');
        penWakeBtn.classList.remove('show');
        canvas.classList.add('drawing-enabled');
      } else {
        toolbar.classList.add('hidden');
        penWakeBtn.classList.add('show');
        canvas.classList.remove('drawing-enabled');
      }
    }
  });

  // 畫布繪製邏輯
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    if (toolbar.classList.contains('hidden')) return;
    isDrawing = true;
    saveState();
    const pos = getPos(e);
    startX = pos.x;
    startY = pos.y;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
  }

  let snapshot = null;

  function drawing(e) {
    if (!isDrawing) return;
    const pos = getPos(e);

    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'eraser') {
      ctx.strokeStyle = '#000000';
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = hexToRgba(currentColor, 0.35);
      ctx.lineWidth = currentSize * 3;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (['line', 'arrow', 'rect', 'circle'].includes(currentTool)) {
      if (!snapshot) {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
      ctx.putImageData(snapshot, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = currentColor;

      if (currentTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (currentTool === 'arrow') {
        drawArrow(ctx, startX, startY, pos.x, pos.y);
      } else if (currentTool === 'rect') {
        ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
      } else if (currentTool === 'circle') {
        const radius = Math.sqrt(Math.pow(pos.x - startX, 2) + Math.pow(pos.y - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function stopDraw() {
    isDrawing = false;
    snapshot = null;
    ctx.closePath();
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', drawing);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: true });
  canvas.addEventListener('touchmove', drawing, { passive: true });
  canvas.addEventListener('touchend', stopDraw);
}

function hexToRgba(hex, alpha) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawArrow(ctx, fromx, fromy, tox, toy) {
  const headlen = 12;
  const dx = tox - fromx;
  const dy = toy - fromy;
  const angle = Math.atan2(dy, dx);
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

/* ==========================================================================
   9. 📱 QR Code 分享與點擊燈箱 (QR Code & Toast Controller)
   ========================================================================== */
function initQrSharing() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  const qrBoxes = document.querySelectorAll('.qr-box');
  const toast = document.getElementById('toastMsg');

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast(`已複製網址到剪貼簿：${url}`);
        }).catch(() => {
          showToast(`複製成功：${url}`);
        });
      } else {
        showToast(`已複製網址：${url}`);
      }
    });
  });

  qrBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const img = box.querySelector('img');
      const title = box.dataset.title || '二維條碼 QR Code 放大';
      if (window.openShowcaseLightbox && img) {
        window.openShowcaseLightbox(img.src, `${title}（手機開啟相機對準即可秒辨識）`);
      }
    });
  });
}
