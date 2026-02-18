function startGame() {
  AppData.moneyPerPoint = +document.getElementById('moneyPerPoint').value;
  AppData.players = [];
  AppData.locked = false;

  localStorage.setItem('billiardData', JSON.stringify(AppData));
  location.href = 'game.html';
}

// LOAD GAME
if (location.pathname.includes('game.html')) {
  Object.assign(AppData, JSON.parse(localStorage.getItem('billiardData')));
  renderPlayers();
}

// THÊM NGƯỜI
function addPlayer() {
  const nameInput = document.getElementById('playerName');
  const name = nameInput.value.trim();

  if (!name) {
    Swal.fire('⚠️ Vui lòng nhập tên');
    return;
  }

  AppData.players.push({ name, point: 0 });
  save();

  nameInput.value = '';
  bootstrap.Modal.getInstance(
    document.getElementById('addPlayerModal')
  ).hide();

  renderPlayers();
}

// RENDER
function renderPlayers() {
  const container = document.getElementById('players');
  container.innerHTML = '';

  if (AppData.players.length === 0) {
    container.innerHTML = `
      <div class="text-center text-muted">
        Chưa có người chơi
      </div>`;
    return;
  }

  AppData.players.forEach((p, i) => {
container.innerHTML += `
  <div class="col-12">
    <div class="player-card">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="d-flex align-items-center gap-3">
          <div class="avatar-cyber">${p.name.charAt(0).toUpperCase()}</div>
          <div>
            <h6 class="mb-0 fw-bold text-white">${p.name}</h6>
            <small class="text-info" style="font-size: 0.6rem; letter-spacing: 1px;">USER_ID: 0${i+1}</small>
          </div>
        </div>
        <button class="btn-delete" style="background:none; border:none; color: #475569;" onclick="removePlayer(${i})">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="text-center py-2">
        <div style="font-size: 0.6rem; color: var(--primary); letter-spacing: 2px;">ĐIỂM</div>
        <div class="main-score ${p.point > 0 ? 'text-success' : p.point < 0 ? 'text-danger' : 'text-white-50'}">
          ${p.point}
        </div>
      </div>

      <div class="d-flex gap-2">
        <button class="control-btn btn-minus" onclick="changePoint(${i}, -1)">
          <i class="bi bi-dash-lg"></i>
        </button>
        <button class="control-btn btn-plus" onclick="changePoint(${i}, 1)">
          <i class="bi bi-plus-lg"></i>
        </button>
      </div>
    </div>
  </div>
`;
  });
}



function changePoint(i, v) {
  if (AppData.locked) return;

  AppData.players[i].point += v;
  save();
  renderPlayers();
}


function calculateMoney() {
  const { players } = AppData;

  // 1. Kiểm tra số lượng người chơi
  if (players.length < 2) {
    Swal.fire({
      icon: 'info',
      title: '<span style="color: #fff; font-weight:800">THIẾU CƠ THỦ</span>',
      html: '<p style="color: #94a3b8">Cần ít nhất 2 người để bắt đầu tính toán tiền cược.</p>',
      background: '#1e293b',
      confirmButtonColor: '#4ade80',
      confirmButtonText: 'Đã hiểu',
      customClass: {
        popup: 'rounded-5 border border-secondary'
      },
      showClass: { popup: 'animate__animated animate__zoomIn' }
    });
    return;
  }

  // 2. Kiểm tra tổng điểm (Tổng điểm bida phải bằng 0)
  const total = players.reduce((s, p) => s + p.point, 0);
  if (total !== 0) {
    Swal.fire({
      icon: 'warning',
      title: '<span style="color: #fff; font-weight:800">CHƯA CÂN BẰNG</span>',
      html: `
        <div class="text-start p-3 rounded-4" style="background: rgba(0,0,0,0.2); color: #94a3b8">
          <p class="mb-2">Tổng điểm hiện tại: <b class="text-warning">${total}</b></p>
          <small>Để tính tiền, tổng điểm của tất cả người chơi phải bằng <b>0</b>.</small>
        </div>
      `,
      background: '#1e293b',
      confirmButtonColor: '#fb7185',
      confirmButtonText: 'Kiểm tra lại',
      customClass: {
        popup: 'rounded-5 border border-secondary'
      },
      showClass: { popup: 'animate__animated animate__shakeX' }
    });
    return;
  }

  // 3. Thông báo thành công trước khi chuyển trang
  Swal.fire({
    title: '<span style="color: #fff">ĐANG XỬ LÝ...</span>',
    timer: 1000,
    timerProgressBar: true,
    background: '#1e293b',
    didOpen: () => {
      Swal.showLoading();
      save();
    },
    willClose: () => {
      location.href = 'result.html';
    }
  });
}

function save() {
  localStorage.setItem('billiardData', JSON.stringify(AppData));
}
function removePlayer(index) {
  if (AppData.locked) return;

  // Rung nhẹ điện thoại để cảnh báo (nếu là mobile)
  if (navigator.vibrate) navigator.vibrate(50);

  const player = AppData.players[index];

  Swal.fire({
    title: '<span style="color: #fff; font-weight:800">XOÁ CƠ THỦ?</span>',
    html: `
      <div class="p-3 rounded-4 mb-2" style="background: rgba(239, 68, 68, 0.1); border: 1px dashed #ef4444;">
        <p class="mb-0 text-white-50">Bạn có chắc muốn xoá <b class="text-danger">${player.name}</b> khỏi danh sách ván đấu không?</p>
      </div>
    `,
    icon: 'warning',
    iconColor: '#ef4444',
    background: '#1e293b',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', // Màu đỏ cho hành động xoá
    cancelButtonColor: '#475569', // Màu xám cho hành động huỷ
    confirmButtonText: 'ĐÚNG, XOÁ NGAY',
    cancelButtonText: 'HUỶ BỎ',
    reverseButtons: true, // Đưa nút Huỷ sang trái, Xoá sang phải (chuẩn UX mobile)
    customClass: {
      popup: 'rounded-5 border border-secondary',
      confirmButton: 'rounded-pill px-4 fw-bold',
      cancelButton: 'rounded-pill px-4'
    },
    showClass: {
      popup: 'animate__animated animate__headShake' // Hiệu ứng lắc đầu cảnh báo
    }
  }).then((res) => {
    if (res.isConfirmed) {
      // Hiệu ứng xoá thành công
      AppData.players.splice(index, 1);
      save();
      renderPlayers();

      // Thông báo nhỏ (Toast) ở góc để không gây phiền
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#1e293b',
        color: '#fff'
      });
      Toast.fire({
        icon: 'success',
        title: `Đã xoá ${player.name}`
      });
    }
  });
}
