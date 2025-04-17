const { exec } = require('child_process');


console.log("🚀 Đang khởi động server_use_cookie.js...");
exec('start cmd /k node  server_use_cookie.js');

setTimeout(() => {
  console.log("🌐 Đang mở live-server và giao diện...");
  exec('start cmd /k live-server');
}, 3000);
