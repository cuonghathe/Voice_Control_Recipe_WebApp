Đây là sản phẩm website chia sẻ công thức nấu ăn tích hợp điều khiển giọng nói và tường thuật văn bản của sinh viên Nguyễn Thế Hà Cường- mã sinh viên 11221168, giáo viên hướng dẫn Nguyễn Trung Tuấn

Đây là website chia sẻ công thức nấu ăn cho phép người dùng:

Tìm kiếm & xem các công thức chi tiết

Điều chỉnh số lượng suất ăn và tự động cập nhật nguyên liệu

Điều khiển trang bằng giọng nói

Tường thuật văn bản (Text-to-Speech) cho nguyên liệu, hướng dẫn và phụ lục

Trò chuyện với Chatbot AI hỗ trợ nấu ăn

Đăng tải, đánh giá và bình luận công thức

Cấu trúc dự án
project/
│── frontend/      
│── server/        
│── README.md

frontend: giao diện người dùng React
server: API backend (Node.js, Express, MongoDB)


## Getting Started

Tại .env của frontend thay các giá trị bằng key
REACT_APP_API_KEY=YOUR_GEMINI_API_KEY
REACT_APP_API_FILTERAIKEY=YOUR_SAFETY_FILTER_KEY

Tại .env của frontend
MONGO_URI=YOUR_MONGODB_URI
EMAIL=YOUR_EMAIL
PASSWORD=YOUR_EMAIL_PASSWORD
SECRET_KEY=YOUR_SECRET_KEY

Chạy lệnh: npm install để tải tất cả thư viện
Sau đó chạy câu lệnh:

```bash
cd server
npm run dev

```
```bash
cd frontend
npm start

```

Mở trang [http://localhost:3000](http://localhost:3000) trên trình duyệt web để xem kết quả.
