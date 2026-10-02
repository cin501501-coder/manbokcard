/**
 * 만복이네 떡집 - 이야기 간추리기 활동 스크립트
 * 초등학교 3학년 대상 웹 어플리케이션
 */

// 19개 카드 정보 데이터 정의
const CARDS_DATA = [
  { id: 1, file: '사건카드_01_압축.jpg', title: '1. 입에서 욕이 나오는 만복이', desc: '친구에게 심술을 부리고 나쁜 말이 튀어나와요.' },
  { id: 2, file: '사건카드_02_압축.jpg', title: '2. 친구와 주먹다짐을 하는 만복이', desc: '친구와 싸움이 붙어 뒹굴며 몸싸움을 해요.' },
  { id: 3, file: '사건카드_03_압축.jpg', title: '3. 선생님께 혼나는 만복이', desc: '선생님 앞에서 고개를 푹 숙이고 꾸중을 들어요.' },
  { id: 4, file: '사건카드_04_압축.jpg', title: '4. 친구들의 손가락질과 외톨이', desc: '친구들의 비난과 차가운 시선에 마음이 아파요.' },
  { id: 5, file: '사건카드_05_압축.jpg', title: '5. 신비한 만복이네 떡집 발견', desc: '골목길에서 자신의 이름과 똑같은 떡집을 발견해요.' },
  { id: 6, file: '사건카드_06_압축.jpg', title: '6. 떡집 안으로 들어간 만복이', desc: '신기한 떡들이 가득한 떡집 가게 안을 둘러보아요.' },
  { id: 7, file: '사건카드_07_압축.jpg', title: '7. 입이 떡 달라붙는 찹쌀떡', desc: '입이 찰싹 달라붙어 나쁜 말이 나오지 않아요.' },
  { id: 8, file: '사건카드_08_압축.jpg', title: '8. 달콤한 바람떡을 먹은 만복이', desc: '입에서 몽글몽글 향기로운 거짓말과 재미난 말이 나와요.' },
  { id: 9, file: '사건카드_09_압축.jpg', title: '9. 신기한 일이 벌어지기 시작해요', desc: '만복이의 입에서 놀라운 말들이 쏟아져 나와요.' },
  { id: 10, file: '사건카드_10_압축.jpg', title: '10. 친구 손에 밴드를 붙여주는 만복이', desc: '다친 친구를 도와주고 착한 일을 실천해요.' },
  { id: 11, file: '사건카드_11_압축.jpg', title: '11. 남의 말이 들리는 쑥떡', desc: '귀가 쫑긋해지며 친구들의 따뜻한 진심이 들려요.' },
  { id: 12, file: '사건카드_12_압축.jpg', title: '12. 친구들의 이야기를 듣는 만복이', desc: '친구들이 하는 말을 가만히 귀 기울여 들어요.' },
  { id: 13, file: '사건카드_13_압축.jpg', title: '13. 눈물 서린 무지개떡', desc: '눈물이 왈칵 쏟아지며 마음속 응어리가 풀려요.' },
  { id: 14, file: '사건카드_14_압축.jpg', title: '14. 펑펑 눈물을 흘리는 만복이', desc: '참았던 눈물을 흘리며 지난 잘못을 뉘우쳐요.' },
  { id: 15, file: '사건카드_15_압축.jpg', title: '15. 입안 가득 꿀떡을 먹는 만복이', desc: '달콤한 꿀떡을 먹고 친구들에게 칭찬을 건네요.' },
  { id: 16, file: '사건카드_16_압축.jpg', title: '16. 친구들과 다정하게 웃는 만복이', desc: '친구들과 사이좋게 어울리며 환하게 웃어요.' },
  { id: 17, file: '사건카드_17_압축.jpg', title: '17. 아이들에게 인기 만점이 된 만복이', desc: '친구들이 만복이 주위로 모여들어 즐거워해요.' },
  { id: 18, file: '사건카드_18_압축.jpg', title: '18. 사랑과 우정을 나눈 만복이', desc: '따뜻한 마음을 나누며 진정한 친구가 되어요.' },
  { id: 19, file: '사건카드_19_압축.jpg', title: '19. 새로운 발걸음을 내딛는 만복이', desc: '간판 이름이 사라진 떡집을 뒤로하고 씩씩하게 걸어가요.' }
];

// 애플리케이션 상태
const state = {
  displayOrder: [],          // 현재 화면에 표시되는 19장 카드 ID 배열 (랜덤)
  selectedCards: [],         // 선택된 카드 객체 배열 [{ id, text }] (최대 3개)
  soundEnabled: true,        // 효과음 활성화 여부
  studentInfo: {
    grade: '3',
    className: '',
    name: ''
  }
};

// 효과음 신디사이저 (Web Audio API)
class SoundPlayer {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playPop() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.log('Audio play error:', e);
    }
  }

  playDeselect() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {
      console.log('Audio play error:', e);
    }
  }

  playFanfare() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // 도, 미, 솔, 높은도
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + idx * 0.1;
        gain.gain.setValueAtTime(0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch (e) {
      console.log('Audio play error:', e);
    }
  }

  playClick() {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.log('Audio play error:', e);
    }
  }
}

const sounds = new SoundPlayer();

// 유틸리티 함수: 배열 랜덤 셔플 (Fisher-Yates)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 토스트 메시지 표시
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-text');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// DOM 요소 참조
const galleryGrid = document.getElementById('card-gallery-grid');
const selectedGrid = document.getElementById('selected-cards-grid');
const emptySelectionNotice = document.getElementById('empty-selection-notice');
const selectedCountEl = document.getElementById('selected-count');
const dot1 = document.getElementById('dot-1');
const dot2 = document.getElementById('dot-2');
const dot3 = document.getElementById('dot-3');
const summaryParagraph = document.getElementById('summary-paragraph');

// 초기화
function initApp() {
  // 이전 선택 기록이 남아있지 않도록 항상 깨끗한 빈 상태(0장)로 초기화
  try {
    localStorage.removeItem('manbok_story_activity');
  } catch (e) {}

  state.selectedCards = [];

  // 19개 카드의 ID 리스트 생성 후 랜덤 셔플
  const initialIds = CARDS_DATA.map(c => c.id);
  state.displayOrder = shuffleArray(initialIds);

  // 학생 정보(학년/반/이름) 불러오기
  loadFromStorage();

  // 갤러리 및 슬롯 렌더링
  renderGallery();
  renderSelectedSlots();
  updateStatusCounter();
  updateSummarySection();

  // 이벤트 리스너 등록
  setupEventListeners();
}

// 19장 갤러리 렌더링
function renderGallery() {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';

  state.displayOrder.forEach(cardId => {
    const cardData = CARDS_DATA.find(c => c.id === cardId);
    if (!cardData) return;

    // 해당 카드가 선택되었는지 확인 및 선택 순서 인덱스 찾기
    const selectedIdx = state.selectedCards.findIndex(item => item.id === cardId);
    const isSelected = selectedIdx !== -1;

    const cardEl = document.createElement('div');
    cardEl.className = `image-card ${isSelected ? 'selected' : ''}`;
    cardEl.setAttribute('data-id', cardId);

    // 카드 번호 배지
    const badgeNum = isSelected ? selectedIdx + 1 : '';

    cardEl.innerHTML = `
      <div class="card-badge-num">${badgeNum}</div>
      <button class="card-zoom-btn" title="그림 크게 보기" data-zoom-id="${cardId}">
        🔍
      </button>
      <div class="card-img-wrapper">
        <img src="${cardData.file}" alt="${cardData.title}" loading="lazy" onerror="this.onerror=null; this.parentElement.classList.add('img-error');" />
      </div>
    `;

    // 카드 클릭 이벤트 (선택/해제)
    cardEl.addEventListener('click', (e) => {
      // 돋보기 버튼 클릭 시에는 선택 토글 방지
      if (e.target.closest('.card-zoom-btn')) return;
      toggleCardSelection(cardId);
    });

    // 돋보기 버튼 클릭 이벤트
    const zoomBtn = cardEl.querySelector('.card-zoom-btn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openZoomModal(cardId);
      });
    }

    galleryGrid.appendChild(cardEl);
  });
}

// 카드 선택 토글 로직
function toggleCardSelection(cardId) {
  const existingIdx = state.selectedCards.findIndex(item => item.id === cardId);

  if (existingIdx !== -1) {
    // 이미 선택된 카드 해제
    state.selectedCards.splice(existingIdx, 1);
    sounds.playDeselect();
    showToast(`선택을 취소했어요. (현재 ${state.selectedCards.length}/3장)`);
  } else {
    // 새로운 카드 선택 시도
    if (state.selectedCards.length >= 3) {
      showToast('⚠️ 카드는 3장까지만 고를 수 있어요! 다른 카드로 바꾸려면 이미 고른 카드를 눌러 취소해 주세요.');
      return;
    }

    state.selectedCards.push({
      id: cardId,
      text: ''
    });

    if (state.selectedCards.length === 3) {
      sounds.playFanfare();
      showToast('🎉 멋져요! 3장의 카드를 모두 골랐어요. 아래에서 사건을 적어보세요!');
      // 3장이 다 골라지면 자연스럽게 작업 영역으로 스크롤 안내
      setTimeout(() => {
        const workspace = document.getElementById('story-workspace');
        if (workspace) {
          workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400);
    } else {
      sounds.playPop();
      showToast(`카드를 골랐어요! (${state.selectedCards.length}/3장)`);
    }
  }

  saveToStorage();
  renderGallery();
  renderSelectedSlots();
  updateStatusCounter();
  updateSummarySection();
}

// 갤러리 영역으로 부드럽게 이동하는 함수
function scrollToGallery() {
  const gallery = document.getElementById('gallery-section');
  if (gallery) {
    gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast('👆 위에서 마음에 드는 사건 카드를 콕 찍어 골라보세요!');
  }
}

// 3개의 카드 슬롯 & 사건 입력창 렌더링 (학생이 카드를 골라야 들어감)
function renderSelectedSlots() {
  if (!selectedGrid) return;

  // 빈 카드 안내 영역은 이제 3개의 슬롯 틀이 항상 보이므로 숨김
  if (emptySelectionNotice) {
    emptySelectionNotice.style.display = 'none';
  }

  selectedGrid.style.display = 'grid';
  selectedGrid.innerHTML = '';

  const slotConfigs = [
    { title: '1. 처음 (첫 번째 사건)', badgeClass: 'slot-1', slotName: '첫 번째 사건' },
    { title: '2. 가운데 (두 번째 사건)', badgeClass: 'slot-2', slotName: '두 번째 사건' },
    { title: '3. 끝 (세 번째 사건)', badgeClass: 'slot-3', slotName: '세 번째 사건' }
  ];

  const placeholders = [
    '예) 만복이가 친구들에게 나쁜 말을 해서 선생님께 꾸중을 들었어요.',
    '',
    ''
  ];

  for (let index = 0; index < 3; index++) {
    const item = state.selectedCards[index];
    const cfg = slotConfigs[index];
    const slotCard = document.createElement('div');

    if (item) {
      // [학생이 카드를 선택한 경우: 카드가 슬롯에 채워짐]
      const cardData = CARDS_DATA.find(c => c.id === item.id);
      const placeholderText = placeholders[index] !== undefined ? placeholders[index] : '';

      slotCard.className = `story-slot-card ${cfg.badgeClass}`;
      slotCard.innerHTML = `
        <div class="slot-header">
          <span class="slot-order-badge">${cfg.title}</span>
          <div class="slot-actions">
            <button type="button" class="btn-slot-move" title="앞으로 이동" data-move-dir="-1" data-index="${index}" ${index === 0 ? 'disabled' : ''}>
              ◀
            </button>
            <button type="button" class="btn-slot-move" title="뒤로 이동" data-move-dir="1" data-index="${index}" ${index === state.selectedCards.length - 1 ? 'disabled' : ''}>
              ▶
            </button>
            <button type="button" class="btn-slot-remove" title="카드 빼기" data-remove-id="${item.id}">
              ✕
            </button>
          </div>
        </div>

        <div class="slot-image-container" data-slot-zoom="${item.id}" title="클릭하여 큰 그림 보기">
          <img src="${cardData ? cardData.file : ''}" alt="${cardData ? cardData.title : ''}" onerror="this.onerror=null; this.parentElement.classList.add('img-error');" />
          <div class="slot-image-overlay">🔍 크게 보기</div>
        </div>

        <div class="event-input-wrapper">
          <div class="input-label-row">
            <label for="event-input-${index}">
              ✍️ 어떤 사건인가요?
              ${index === 0 ? '<span style="font-size: 0.85rem; font-weight: normal; color: #ea580c; background: #ffedd5; padding: 2px 8px; border-radius: 12px; margin-left: 6px;">💡 예시 참고</span>' : ''}
            </label>
            <span class="char-counter" id="counter-${index}">${item.text.length}자</span>
          </div>
          <textarea
            id="event-input-${index}"
            class="event-textarea"
            placeholder="${placeholderText}"
            rows="3"
          >${escapeHtml(item.text)}</textarea>
        </div>
      `;

      // 순서 이동 버튼
      const moveBtns = slotCard.querySelectorAll('.btn-slot-move');
      moveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const dir = parseInt(btn.getAttribute('data-move-dir'), 10);
          moveSlot(index, index + dir);
        });
      });

      // 카드 빼기 버튼
      const removeBtn = slotCard.querySelector('.btn-slot-remove');
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCardSelection(item.id);
        });
      }

      // 이미지 확대 모달
      const imgContainer = slotCard.querySelector('.slot-image-container');
      if (imgContainer) {
        imgContainer.addEventListener('click', () => {
          openZoomModal(item.id);
        });
      }

      // 텍스트 영역 실시간 입력
      const textarea = slotCard.querySelector('.event-textarea');
      const counterSpan = slotCard.querySelector(`#counter-${index}`);
      if (textarea) {
        textarea.addEventListener('input', (e) => {
          item.text = e.target.value;
          if (counterSpan) {
            counterSpan.textContent = `${item.text.length}자`;
          }
          updateSummarySection();
          saveToStorage();
        });
      }
    } else {
      // [학생이 아직 카드를 고르지 않은 경우: 대기 상태의 빈 슬롯 표시]
      slotCard.className = `story-slot-card is-empty ${cfg.badgeClass}`;
      slotCard.innerHTML = `
        <div class="slot-header">
          <span class="slot-order-badge" style="opacity: 0.8; filter: grayscale(0.2);">${cfg.title}</span>
          <span style="font-size: 0.85rem; color: #94a3b8; font-weight: bold;">(대기 중)</span>
        </div>

        <div class="empty-card-placeholder" onclick="scrollToGallery()" title="위에서 카드를 골라보세요!">
          <div class="empty-placeholder-icon">🎴</div>
          <div class="empty-placeholder-text">
            위에서 <strong>${cfg.slotName}</strong><br>카드를 골라주세요!
          </div>
          <div class="empty-placeholder-sub">👆 위 1단계 카드를 누르면 쏙 들어가요!</div>
        </div>

        <div class="empty-input-placeholder">
          <span>카드를 골라 넣으면 여기에 사건을 적는 칸이 열려요 ✏️</span>
        </div>
      `;
    }

    selectedGrid.appendChild(slotCard);
  }
}

// 슬롯 순서 바꾸기 (◀, ▶)
function moveSlot(fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= state.selectedCards.length) return;
  sounds.playClick();
  const temp = state.selectedCards[fromIndex];
  state.selectedCards[fromIndex] = state.selectedCards[toIndex];
  state.selectedCards[toIndex] = temp;

  saveToStorage();
  renderGallery();
  renderSelectedSlots();
  updateSummarySection();
}

// 상단 상태 카운터 업데이트
function updateStatusCounter() {
  const count = state.selectedCards.length;
  if (selectedCountEl) {
    selectedCountEl.textContent = count;
  }

  if (dot1) dot1.className = `counter-dot ${count >= 1 ? 'active' : ''}`;
  if (dot2) dot2.className = `counter-dot ${count >= 2 ? 'active' : ''}`;
  if (dot3) dot3.className = `counter-dot ${count >= 3 ? 'active' : ''}`;
}

// 하단 종합 요약글 업데이트
function updateSummarySection() {
  if (!summaryParagraph) return;

  const validTexts = state.selectedCards
    .map(c => c.text.trim())
    .filter(t => t.length > 0);

  if (validTexts.length === 0) {
    summaryParagraph.innerHTML = `<span class="empty-tip">위에서 3장의 카드를 고르고 각 카드 밑에 일어난 사건을 적으면, 이곳에 간추려진 이야기가 멋지게 완성돼요! 🌟</span>`;
  } else {
    // 3개의 사건을 자연스럽게 연결
    const joined = state.selectedCards.map((c, i) => {
      const stepName = ['[처음]', '[가운데]', '[끝]'][i] || `[${i+1}번째]`;
      const text = c.text.trim() || '(아직 내용을 작성하지 않았어요)';
      return `<strong>${stepName}</strong> ${text}`;
    }).join('<br><br>');

    summaryParagraph.innerHTML = joined;
  }
}

// 19장의 카드 무작위 다시 섞기
function shuffleGalleryCards() {
  sounds.playClick();
  state.displayOrder = shuffleArray(state.displayOrder);
  renderGallery();
  showToast('🔀 19장의 사건 카드를 골고루 다시 섞었어요!');
}

// 전체 초기화
function resetEverything() {
  if (confirm('정말로 처음부터 다시 시작할까요?\n(고른 카드와 작성한 글이 모두 지워집니다.)')) {
    sounds.playClick();
    state.selectedCards = [];
    const initialIds = CARDS_DATA.map(c => c.id);
    state.displayOrder = shuffleArray(initialIds);
    saveToStorage();
    renderGallery();
    renderSelectedSlots();
    updateStatusCounter();
    updateSummarySection();
    showToast('🔄 처음 상태로 깨끗하게 비웠어요.');
  }
}

// 확대 모달 열기
function openZoomModal(cardId) {
  const cardData = CARDS_DATA.find(c => c.id === cardId);
  if (!cardData) return;

  sounds.playClick();
  const modal = document.getElementById('zoom-modal');
  const imgEl = document.getElementById('modal-zoom-img');
  const titleEl = document.getElementById('modal-zoom-title');
  const descEl = document.getElementById('modal-zoom-desc');
  const selectBtn = document.getElementById('modal-btn-select');

  if (!modal || !imgEl) return;

  imgEl.src = cardData.file;
  imgEl.alt = cardData.title;
  if (titleEl) titleEl.textContent = cardData.title;
  if (descEl) descEl.textContent = cardData.desc;

  // 모달 안의 선택/취소 버튼 상태 업데이트
  if (selectBtn) {
    const isSelected = state.selectedCards.some(c => c.id === cardId);
    selectBtn.textContent = isSelected ? '이 카드 선택 취소하기' : '이 카드 고르기 (+1)';
    selectBtn.className = isSelected ? 'btn btn-reset' : 'btn btn-jump-story';

    selectBtn.onclick = () => {
      toggleCardSelection(cardId);
      closeZoomModal();
    };
  }

  modal.classList.add('active');
}

function closeZoomModal() {
  const modal = document.getElementById('zoom-modal');
  if (modal) modal.classList.remove('active');
}

// 꿀팁 안내 모달
function openTipModal() {
  sounds.playClick();
  const modal = document.getElementById('tip-modal');
  if (modal) modal.classList.add('active');
}

function closeTipModal() {
  const modal = document.getElementById('tip-modal');
  if (modal) modal.classList.remove('active');
}

// 인쇄하기 (A4 학습지 양식)
function handlePrint() {
  sounds.playFanfare();
  window.print();
}

// 간추린 이야기 복사하기
function copySummaryText() {
  sounds.playClick();
  const grade = document.getElementById('input-grade')?.value || '3';
  const className = document.getElementById('input-class')?.value || '';
  const studentName = document.getElementById('input-name')?.value || '';

  let copyText = `[만복이네 떡집 - 세 장면 이야기 간추리기]\n`;
  copyText += `학생: ${grade}학년 ${className}반 ${studentName}\n\n`;

  if (state.selectedCards.length === 0) {
    copyText += `선택된 카드가 없습니다.`;
  } else {
    state.selectedCards.forEach((item, index) => {
      const step = ['[처음]', '[가운데]', '[끝]'][index] || `[${index + 1}번째]`;
      const card = CARDS_DATA.find(c => c.id === item.id);
      copyText += `${step} ${card ? card.title : ''}\n내용: ${item.text || '(미작성)'}\n\n`;
    });
  }

  navigator.clipboard.writeText(copyText)
    .then(() => {
      showToast('📋 간추린 이야기 내용이 클립보드에 복사되었어요!');
    })
    .catch(() => {
      showToast('⚠️ 복사에 실패했어요. 권한을 확인해주세요.');
    });
}

// 로컬 스토리지 저장 및 복원
function saveToStorage() {
  try {
    const studentInfo = {
      grade: document.getElementById('input-grade')?.value || '3',
      className: document.getElementById('input-class')?.value || '',
      name: document.getElementById('input-name')?.value || ''
    };
    localStorage.setItem('manbok_student_info', JSON.stringify(studentInfo));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem('manbok_student_info');
    if (!saved) return;
    const parsed = JSON.parse(saved);

    if (parsed) {
      const gInput = document.getElementById('input-grade');
      const cInput = document.getElementById('input-class');
      const nInput = document.getElementById('input-name');
      if (gInput && parsed.grade) gInput.value = parsed.grade;
      if (cInput && parsed.className) cInput.value = parsed.className;
      if (nInput && parsed.name) nInput.value = parsed.name;
    }
  } catch (e) {
    console.error('Storage load error:', e);
  }
}

// HTML 엔티티 이스케이프
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 전체 이벤트 바인딩
function setupEventListeners() {
  // 카드 섞기 버튼
  document.getElementById('btn-shuffle')?.addEventListener('click', shuffleGalleryCards);

  // 처음부터 다시 하기 버튼
  document.getElementById('btn-reset')?.addEventListener('click', resetEverything);

  // 이야기 쓰기로 바로가기 버튼
  document.getElementById('btn-scroll-story')?.addEventListener('click', () => {
    sounds.playClick();
    document.getElementById('story-workspace')?.scrollIntoView({ behavior: 'smooth' });
  });

  // 효과음 토글 버튼
  const soundBtn = document.getElementById('btn-sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      soundBtn.textContent = state.soundEnabled ? '🔊 소리 켜짐' : '🔇 소리 꺼짐';
      showToast(state.soundEnabled ? '🔊 효과음이 켜졌어요.' : '🔇 효과음이 꺼졌어요.');
      if (state.soundEnabled) sounds.playClick();
    });
  }

  // 이야기 간추리기 꿀팁 모달 버튼
  document.getElementById('btn-tip-modal')?.addEventListener('click', openTipModal);
  document.getElementById('btn-close-tip')?.addEventListener('click', closeTipModal);

  // 확대 모달 닫기
  document.getElementById('btn-close-zoom')?.addEventListener('click', closeZoomModal);
  document.getElementById('zoom-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'zoom-modal') closeZoomModal();
  });
  document.getElementById('tip-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'tip-modal') closeTipModal();
  });

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeZoomModal();
      closeTipModal();
    }
  });

  // 하단 액션 버튼
  document.getElementById('btn-print')?.addEventListener('click', handlePrint);
  document.getElementById('btn-copy')?.addEventListener('click', copySummaryText);

  // 학생 정보 입력 시 자동 저장
  ['input-grade', 'input-class', 'input-name'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', saveToStorage);
  });
}

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', initApp);
