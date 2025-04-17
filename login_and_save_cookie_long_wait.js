const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setJavaScriptEnabled(true);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36');

  console.log("➡️ Mở trang login: https://members.boyfriendtv.com/login/");
  await page.goto('https://members.boyfriendtv.com/login/', { waitUntil: 'domcontentloaded' });

  console.log("🕹 Vui lòng tự đăng nhập, vượt xác thực human, và mở 1 video bất kỳ...");
  console.log("⏳ Chờ 60 giây để bạn thao tác...");

  await new Promise(resolve => setTimeout(resolve, 60000)); // cho bạn 60s để login & load video

  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
  console.log("✅ Cookie đã được lưu vào cookies.json");

  await browser.close();
})();
