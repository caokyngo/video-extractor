const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

app.get('/api/get-video', async (req, res) => {
  const pageURL = req.query.url;
  if (!pageURL) return res.status(400).json({ error: 'Thiếu URL video' });

  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // hoặc để trống nếu dùng Chromium mặc định
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setJavaScriptEnabled(true);
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36'
    );

    const cookiePath = path.join(__dirname, 'cookies.json');
    const rawCookies = JSON.parse(fs.readFileSync(cookiePath, 'utf-8'));
    const cookies = rawCookies.map(cookie => {
      if (cookie.sameSite && typeof cookie.sameSite !== 'string') {
        delete cookie.sameSite;
      }
      return cookie;
    });

    await page.setCookie(...cookies);

    const mp4Urls = [];

    page.on('response', async (response) => {
      try {
        const url = response.url();
        const contentType = response.headers()['content-type'] || '';
        if (url.includes('.mp4') && url.includes('ahcdn') && contentType.includes('video')) {
          console.log('🎯 Bắt được video:', url);
          if (!mp4Urls.includes(url)) mp4Urls.push(url);
        }
      } catch (e) {
        console.warn('⚠️ Lỗi khi phân tích response:', e.message);
      }
    });

    console.log("➡️ Truy cập:", pageURL);
    await page.goto(pageURL, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.mouse.click(400, 400); // kích hoạt click play
    await page.evaluate(() => {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        video.play().catch(e => console.warn('Không thể play video:', e));
      }
    });

    await new Promise(resolve => setTimeout(resolve, 12000));
    await browser.close();

    const highQuality = mp4Urls.find(url => url.includes('hq_'));
    const fallback = mp4Urls.find(url => !url.includes('hq_'));

    if (highQuality) {
      res.json({ videoUrl: highQuality });
    } else if (fallback) {
      res.json({ videoUrl: fallback });
    } else {
      res.status(404).json({ error: 'Không tìm thấy video .mp4 từ ahcdn!' });
    }

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    res.status(500).json({ error: 'Lỗi server', detail: err.message });
  }
});
const path = require('path');

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
  console.log('🚀 Server API đang chạy tại http://localhost:3000');
});
