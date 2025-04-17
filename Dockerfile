# Dockerfile
FROM node:18
# Dùng image Node + Puppeteer sẵn có từ browserless/chrome
FROM ghcr.io/puppeteer/puppeteer:latest

# Tạo thư mục app
WORKDIR /app

# Copy toàn bộ source
COPY . .

# 👇 Thêm dòng này để cấp quyền
RUN chown -R node:node /app

# Expose port Railway sẽ dùng
ENV PORT=3000
EXPOSE 3000

# Chạy dưới quyền user node
USER node

# Copy package info trước để cài dependency
COPY package.json package-lock.json* ./
RUN npm install
CMD ["node", "server_use_cookie.js"]