const data = JSON.parse(localStorage.getItem('billiardData'));

if (!data) {
  Swal.fire('Không có dữ liệu!');
  location.href = 'index.html';
}

const tbody = document.getElementById('resultBody');
const totalMoneyEl = document.getElementById('totalMoney');

// thời gian
document.getElementById('time').innerText =
  '🕒 ' + new Date().toLocaleString('vi-VN');

let totalMoney = 0;

data.players.forEach(p => {
  const money = p.point * data.moneyPerPoint;
  totalMoney += Math.abs(money);

  tbody.innerHTML += `
    <tr>
      <td>${p.name}</td>
      <td>${p.point}</td>
      <td class="${money < 0 ? 'text-danger' : 'text-success'}">
        ${money.toLocaleString()} đ
      </td>
    </tr>
  `;
});

totalMoneyEl.innerText = totalMoney.toLocaleString();

// 🔒 khoá điểm
data.locked = true;
localStorage.setItem('billiardData', JSON.stringify(data));

function resetAll() {
  Swal.fire({
    title: 'Reset toàn bộ?',
    text: 'Dữ liệu sẽ bị xoá',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Reset',
    cancelButtonText: 'Huỷ'
  }).then(res => {
    if (res.isConfirmed) {
      localStorage.removeItem('billiardData');
      location.href = 'index.html';
    }
  });
}

function goBack() {
  Swal.fire('🔒 Điểm đã khóa, không thể sửa!');
}
