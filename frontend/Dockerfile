# 使用 Node.js 作為基礎映像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有檔案
COPY . .

# 暴露 3000 端口（React 開發伺服器默認端口）
EXPOSE 3000

# 啟動開發伺服器
CMD ["npm", "start"]