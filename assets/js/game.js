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
        <div class="card p-3 rounded-4 mb-2 shadow-sm">

          <!-- TÊN + XOÁ -->
          <div class="d-flex justify-content-between align-items-center">
            <div class="fw-semibold fs-5">${p.name}</div>

            <button class="btn btn-outline-danger btn-sm"
              onclick="removePlayer(${i})">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <!-- ĐIỂM -->
          <div class="text-center my-3">
            <span class="fw-bold display-6
              ${p.point > 0 ? 'text-success' : p.point < 0 ? 'text-danger' : 'text-secondary'}">
              ${p.point}
            </span>
          </div>

          <!-- + - -->
          <div class="d-flex justify-content-center gap-4">
            <button style="width: 50%;" class="btn btn-outline-danger btn-lg px-4"
              onclick="changePoint(${i}, -1)">➖</button>

            <button style="width: 50%;" class="btn btn-outline-success btn-lg px-4"
              onclick="changePoint(${i}, 1)">➕</button>
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
  if (AppData.players.length < 2) {
    Swal.fire('⚠️ Cần ít nhất 2 người chơi');
    return;
  }

  const total = AppData.players.reduce((s, p) => s + p.point, 0);
  if (total !== 0) {
    Swal.fire('⚠️ Tổng điểm chưa cân');
    return;
  }

  save();
  location.href = 'result.html';
}

function save() {
  localStorage.setItem('billiardData', JSON.stringify(AppData));
}
function removePlayer(index) {
  if (AppData.locked) return;

  Swal.fire({
    title: 'Xoá người chơi?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xoá',
    cancelButtonText: 'Huỷ'
  }).then(res => {
    if (res.isConfirmed) {
      AppData.players.splice(index, 1);
      save();
      renderPlayers();
    }
  });
}
