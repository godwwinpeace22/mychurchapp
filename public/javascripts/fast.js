console.log(document.getElementById('startTime').getAttribute('startTime'))
var c = document.getElementById('startTime').getAttribute('startTime');
c * 1 > 0 ? c - Date.now() < 0 ? 
window.location.href = '/quiz/completed' : '': ''
console.log('this is fast na');