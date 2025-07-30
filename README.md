# minhhuy-editor-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Minh Huy Portfolio Editor

Website giới thiệu cá nhân / portfolio được xây dựng bằng Vue.js + Laravel với tính năng quản trị nội dung động.

## Tính năng chính

- ✨ **Đa ngôn ngữ** (Tiếng Việt/English)
- 📱 **Giao diện responsive** trên mọi thiết bị
- 🎨 **Trang portfolio** hiển thị dự án
- 👤 **Trang giới thiệu** cá nhân
- 📧 **Trang liên hệ** với form gửi tin nhắn
- 🛠️ **Quản trị backend** với Laravel
- 🔐 **Xác thực đăng nhập** qua Laravel Sanctum
- 📝 **Quản lý nội dung** động từ admin panel

## Công nghệ sử dụng

### Frontend
- **Vue 3** - Progressive JavaScript Framework
- **Vue Router** - Official router for Vue.js

### Backend
- **Laravel 8** - PHP web application framework
- **Laravel Sanctum** - API authentication
- **MySQL** - Cơ sở dữ liệu quan hệ
- **RESTful API** - Giao tiếp giữa frontend và backend

## Cấu trúc dự án

```
minhhuy-portfolio/
├── frontend/           # Vue.js application
│   ├── src/
│   ├── public/
│   └── package.json
└── backend/            # Laravel API
    ├── app/
    ├── database/
    └── composer.json
```

## Repository Links

- **Frontend**: [minhhuy-editor-portflios](https://github.com/ttphong1210/minhhuy-editor-portflios)
- **Backend**: [minhhuy-editor-portflios-BE](https://github.com/ttphong1210/minhhuy-editor-portflios-BE)

## Cài đặt và Chạy dự án

### Backend (Laravel)

1. **Clone repository backend**
```bash
git clone https://github.com/ttphong1210/minhhuy-editor-portflios-BE.git
cd minhhuy-editor-portflios-BE
```

2. **Cài đặt dependencies**
```bash
composer install
```

3. **Cấu hình môi trường**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Cấu hình database trong file .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=database_name
DB_USERNAME=username
DB_PASSWORD=password
```

5. **Chạy migration và seeder**
```bash
php artisan migrate --seed
```

6. **Khởi động server**
```bash
php artisan serve
```

### Frontend (Vue.js)

1. **Clone repository frontend**
```bash
git clone https://github.com/ttphong1210/minhhuy-editor-portflios.git
cd minhhuy-editor-portflios
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Khởi động development server**
```bash
npm run serve
```

4. **Build cho production**
```bash
npm run build
```

5. **Lint code**
```bash
npm run lint
```

## Tài khoản Admin

Để truy cập trang quản trị:

- **Email**: admin123@gmail.com
- **Password**: admin123456
- **URL Admin**: `http://localhost:8082/admin`

## API Endpoints

### Authentication (Sanctum)
- `POST /api/login` - Đăng nhập
- `POST /api/logout` - Đăng xuất
- `GET /api/user` - Lấy thông tin user

### Portfolio Management
- `GET /api/portfolios` - Lấy danh sách portfolio
- `POST /api/portfolios` - Tạo portfolio mới
- `PUT /api/portfolios/{id}` - Cập nhật portfolio
- `DELETE /api/portfolios/{id}` - Xóa portfolio

### Content Management
- `GET /api/about` - Lấy thông tin giới thiệu
- `PUT /api/about` - Cập nhật thông tin giới thiệu
- `POST /api/contact` - Gửi tin nhắn liên hệ

## Liên hệ

- **Developer**: Trần Thế Phong
- **GitHub**: [@ttphong1210](https://github.com/ttphong1210)
- **Email**: tranthephong1210@gmail.com
