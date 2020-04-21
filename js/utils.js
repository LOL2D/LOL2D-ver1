function secondsToMinutes(seconds) {
  return timeNum(floor(seconds / 60)) + ":" + timeNum(seconds % 60);
}
function timeNum(num) {
  return num < 10 ? `0${num}` : num;
}
