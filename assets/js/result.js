// 1. Lấy dữ liệu từ LocalStorage
const data = JSON.parse(localStorage.getItem('billiardData'));

// 2. Kiểm tra dữ liệu hợp lệ
if (!data || !data.players) {
  Swal.fire({
    icon: 'error',
    title: 'Lỗi!',
    text: 'Không có dữ liệu ván đấu.',
    background: '#1e293b',
    confirmButtonColor: '#4ade80'
  }).then(() => {
    location.href = 'index.html';
  });
}

// 3. Khai báo các element
const resultList = document.getElementById('resultList'); // Chú ý: Đổi ID resultBody thành resultList trong HTML
const totalMoneyEl = document.getElementById('totalMoney');
const timeEl = document.getElementById('time');

// 4. Hiển thị thời gian ván đấu
timeEl.innerText = '🕒 ' + new Date().toLocaleString('vi-VN');

// 5. Khởi tạo biến tính toán
let totalWinMoney = 0;
const moneyPerPoint = data.moneyPerPoint || 0;

// 6. Xử lý logic và Render
function renderResults() {
  if (!resultList) return;
  resultList.innerHTML = '';

  data.players.forEach((p, i) => {
    const money = p.point * moneyPerPoint;
    const isWin = money >= 0;

    // Cộng dồn tổng tiền thắng (tổng độ của ván)
    if (isWin) totalWinMoney += money;

    // Render giao diện thẻ (Match với HTML mới)
    resultList.innerHTML += `
      <div class="result-item animate__animated animate__fadeInUp" style="animation-delay: ${i * 0.1}s">
        <div class="player-meta">
          <div class="avatar-sm" style="width:42px; height:42px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:14px; display:flex; align-items:center; justify-content:center; font-weight:800; color: ${isWin ? '#4ade80' : '#fb7185'}">
            ${p.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div class="fw-bold text-white">${p.name}</div>
            <span class="point-badge ${isWin ? 'text-success' : 'text-danger'}" style="background: rgba(255,255,255,0.03)">
               ${p.point > 0 ? '+' : ''}${p.point} điểm
            </span>
          </div>
        </div>
        <div class="money-amount ${isWin ? 'money-plus' : 'money-minus'}">
          ${isWin ? '+' : ''}${money.toLocaleString()}đ
        </div>
      </div>
    `;
  });

  // Hiển thị tổng tiền
  totalMoneyEl.innerText = totalWinMoney.toLocaleString() + ' đ';
}

// 7. Chạy hàm render
renderResults();

// 8. 🔒 Khóa điểm ngay khi vào trang kết quả
data.locked = true;
localStorage.setItem('billiardData', JSON.stringify(data));

// 9. Các hàm điều hướng
function resetAll() {
  Swal.fire({
    title: '<span style="color: #fff">VÁN MỚI?</span>',
    text: 'Dữ liệu hiện tại sẽ bị xóa để bắt đầu ván mới.',
    icon: 'warning',
    showCancelButton: true,
    background: '#1e293b',
    confirmButtonColor: '#fb7185',
    cancelButtonColor: '#475569',
    confirmButtonText: 'XÁC NHẬN RESET',
    cancelButtonText: 'HUỶ',
    reverseButtons: true,
    customClass: {
        popup: 'rounded-5'
    }
  }).then(res => {
    if (res.isConfirmed) {
      localStorage.removeItem('billiardData');
      location.href = 'index.html';
    }
  });
}

function goBack() {
  Swal.fire({
    icon: 'info',
    title: '<span style="color: #fff">THÔNG BÁO</span>',
    text: 'Ván đấu đã kết thúc và khóa điểm. Bạn không thể sửa lại điểm số lúc này!',
    background: '#1e293b',
    confirmButtonColor: '#4ade80',
    customClass: {
        popup: 'rounded-5'
    }
  });
}