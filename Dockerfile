# 1. Chọn image Node.js chính thức
FROM node:18

# 2. Tạo thư mục làm việc
WORKDIR /app

# 3. Copy package.json và cài đặt trước để dùng cache
COPY package*.json ./

# 4. Cài dependencies
RUN npm install

# 5. Copy toàn bộ source code trừ node_modules
COPY . .

# 6. Cấu hình để Puppeteer chạy trong Docker
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# 7. Cài đặt Chrome cho Puppeteer
RUN apt-get update && apt-get install -y wget gnupg ca-certificates && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# 8. Expose port Railway yêu cầu
EXPOSE 3000

# 9. Khởi chạy ứng dụng
CMD ["npm", "start"]
