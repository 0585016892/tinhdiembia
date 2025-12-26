const AppData = {
  players: [],
  moneyPerPoint: 0,
  locked: false
};
// Chặn swipe back trên iOS
let startX = 0;

document.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', e => {
  if (startX < 20) {
    e.preventDefault();
  }
}, { passive: false });