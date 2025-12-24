
# ⚡ TANDEV LOADER

**THE ULTIMATE MINIMALIST SOCIAL MEDIA DOWNLOADER.**  
*Bởi Tandev.foto*

---

## 🖤 TỔNG QUAN (OVERVIEW)

**TANDEV LOADER** là một công cụ hỗ trợ tải đa phương tiện (ảnh, video, audio) từ tất cả các nền tảng mạng xã hội phổ biến nhất hiện nay như YouTube, TikTok, Instagram, Facebook... Ứng dụng được thiết kế theo phong cách **Modern Brutalism** (Trắng/Đen).

## 🚀 TÍNH NĂNG NỔI BẬT (FEATURES)

- **Đa nền tảng:** Hỗ trợ YouTube, TikTok (không watermark), Instagram, Facebook...
- **Phân tích thông minh:** Sử dụng Gemini API để trích xuất metadata.
- **iOS Shortcut Ready:** Tích hợp sâu với ứng dụng Phím tắt trên iPhone.

## 📦 HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES

Để ứng dụng hoạt động trên GitHub, bạn không thể chỉ upload file lên, mà cần build.

### Cách 1: Sử dụng GitHub Actions (Khuyên dùng)
Project này đã có file `.github/workflows/deploy.yml`. Bạn chỉ cần:
1. Đẩy code lên branch `main` của GitHub.
2. Vào Settings của Repo -> **Pages**.
3. Tại phần **Build and deployment**, mục **Source**, chọn **GitHub Actions**.
4. GitHub sẽ tự động build và cấp link cho bạn sau khoảng 1-2 phút.

### Cách 2: Deploy thủ công (Local)
1. Cài đặt Node.js.
2. Chạy `npm install`.
3. Chạy `npm run build`.
4. Upload toàn bộ nội dung trong thư mục `dist` lên branch `gh-pages` hoặc dùng tool như `gh-pages` npm package.

## 🔑 LƯU Ý VỀ API KEY
Khi deploy lên GitHub Pages, biến `process.env.API_KEY` cần được cấu hình. Nếu bạn dùng public repository, hãy cẩn thận vì API Key có thể bị lộ trong mã nguồn đã build. Khuyên dùng **GitHub Secrets** nếu build qua Actions.

## 📜 BẢN QUYỀN (LICENSE)

© 2024 - 2025 BY **TANDEV.FOTO**.
