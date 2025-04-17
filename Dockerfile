# Dockerfile

# Dùng image Node + Puppeteer sẵn có từ browserless/chrome
FROM ghcr.io/puppeteer/puppeteer:latest

# Tạo thư mục app
WORKDIR /app

# Copy package info trước để cài dependency
COPY package.json package-lock.json* ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Expose port Railway sẽ dùng
ENV PORT=3000
EXPOSE 3000

# Start server
CMD ["node", "server_use_cookie.js"]
