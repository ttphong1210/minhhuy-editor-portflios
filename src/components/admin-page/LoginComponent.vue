<template>
  <div v-if="showLoginForm" id="loginPage" class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Đăng nhập Admin</h1>
        <p>Quản lý Portfolio của Bùi Lê Minh Huy</p>
      </div>
      <form id="loginForm">
        <div class="form-group">
          <label for="loginEmail">Email</label>
          <input
            type="email"
            id="loginEmail"
            v-model="form_login.email"
            required
          />
          <p v-if="errors.email" class="text-red">{{ errors.email }}</p>

        </div>
        <div class="form-group">
          <label for="loginPassword">Mật khẩu</label>
          <input
            type="password"
            id="loginPassword"
            v-model="form_login.password"
            required
          />
            <p v-if="errors.password" class="text-red">{{ errors.password }}</p>
        </div>
        <button
          @click.prevent="validateLoginForm()"
          type="submit"
          class="btn btn-primary"
        >
          <span class="btn-text">Đăng nhập</span>
        </button>
      </form>
      <div class="auth-switch">
        Chưa có tài khoản?
        <a href="#" @click.prevent="showLoginForm = false">Đăng ký ngay</a>
      </div>
    </div>
  </div>

  <!-- Register Form -->
  <div v-else id="registerPage" class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Đăng ký Admin</h1>
        <p>Tạo tài khoản quản lý Portfolio</p>
      </div>
      <form id="registerForm">
        <div class="form-group">
          <label for="registerName">Họ và tên</label>
          <input
            type="text"
            id="registerName"
            v-model="form_register.name"
            required
          />
          <p v-if="errors.name" class="text-red">{{ errors.name }}</p>
        </div>
        <div class="form-group">
          <label for="registerEmail">Email</label>
          <input
            type="email"
            id="registerEmail"
            v-model="form_register.email"
            required
          />
          <p v-if="errors.email" class="text-red">{{ errors.email }}</p>
        </div>
        <div class="form-group">
          <label for="registerPassword">Mật khẩu</label>
          <input
            type="password"
            id="registerPassword"
            v-model="form_register.password"
            minlength="6"
            required
          />
          <p v-if="errors.password" class="text-red">{{ errors.password }}</p>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form_register.confirmPassword"
            minlength="6"
            required
          />
          <p v-if="errors.confirmPassword" class="text-red">
            {{ errors.confirmPassword }}
          </p>
        </div>
        <button
          @click.prevent="validateRegisterForm()"
          type="submit"
          class="btn btn-primary"
        >
          <span class="btn-text">Đăng ký</span>
        </button>
      </form>
      <div class="auth-switch">
        Đã có tài khoản?
        <a href="#" @click.prevent="showLoginForm = true">Đăng nhập</a>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/axios";

export default {
  data() {
    return {
      showLoginForm: true,
      form_register: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      form_login: {
        email: "",
        password: "",
      },
      errors: {},
    };
  },
  methods: {
    validateRegisterForm() {
      this.errors = {};
      if (!this.form_register.name.trim()) {
        this.errors.name = "Vui lòng nhập họ tên";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form_register.email.trim()) {
        this.errors.email = "Vui lòng nhập email";
      } else if (!emailRegex.test(this.form_register.email)) {
        this.errors.email = "Email không hợp lệ";
      }

      if (!this.form_register.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
      } else if (this.form_register.password.length < 6) {
        this.errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }

      if (this.form_register.confirmPassword !== this.form_register.password) {
        this.errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
      if (Object.keys(this.errors).length === 0) {
        this.submitRegister();
      }
    },

    validateLoginForm() {
      this.errors = {};
      if (!this.form_login.email.trim()) {
        this.errors.email = "Vui lòng nhập email";
      }
      if (!this.form_login.password) {
        this.errors.password = "Vui lòng nhập mật khẩu";
      }
      if( Object.keys(this.errors).length === 0) {
        this.submitLogin();
      }
    },

    async submitRegister() {
      const formData = new FormData();
      formData.append("name", this.form_register.name);
      formData.append("email", this.form_register.email);
      formData.append("password", this.form_register.password);
      formData.append(
        "password_confirmation",
        this.form_register.confirmPassword
      );
      try {
        const response = await api.post("users", formData);
        this.form_register = {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        };
        if (response.data.success) {
          this.showLoginForm = true;
          this.errors = {};
          alert("Đăng ký thành công! Vui lòng đăng nhập.");
        } else {
          this.errors.general = "Đăng ký không thành công. Vui lòng thử lại.";
        }
      } catch (e) {
        console.error("Đăng ký thất bại:", e);
        this.errors.general = "Đăng ký không thành công. Vui lòng thử lại.";
      }
    },
    async submitLogin() {
      const formData = new FormData();
      formData.append("email", this.form_login.email);
      formData.append("password", this.form_login.password);
      try {
        const response = await api.post("users/login", formData);
        if (response.data.success) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("token", response.data.token);
          this.$router.push("/admin");
        } else {
          this.errors.general =
            "Đăng nhập không thành công. Vui lòng kiểm tra lại email và mật khẩu.";
        }
      } catch (e) {
        console.error("Đăng nhập thất bại:", e);
        this.errors.general = "Đăng nhập không thành công. Vui lòng thử lại.";
      }
    },
  },
};
</script>

<style scoped>
#loginPage,
#registerPage {
  background: linear-gradient(
    135deg,
    #0f0f23 0%,
    #1a1a2e 50%,
    #16213e 100%
  ) !important;
  min-height: 100vh;
}
/* Login/Register Forms */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(
    circle at center,
    rgba(77, 171, 247, 0.1) 0%,
    transparent 70%
  );
}

.auth-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(77, 171, 247, 0.2);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ff6b35, #4dabf7);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  color: #ff6b35;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.auth-header p {
  color: #cccccc;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: #4dabf7;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(77, 171, 247, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4dabf7;
  box-shadow: 0 0 0 3px rgba(77, 171, 247, 0.1);
  transform: translateY(-2px);
}

.btn {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #ff6b35, #ff8c42);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #4dabf7;
  border: 2px solid #4dabf7;
}

.btn-secondary:hover {
  background: #4dabf7;
  color: #0f0f23;
}

.btn-danger {
  background: linear-gradient(135deg, #ff4757, #ff3742);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4);
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
  color: #cccccc;
}

.auth-switch a {
  color: #4dabf7;
  text-decoration: none;
  font-weight: 600;
}

.auth-switch a:hover {
  color: #ff6b35;
}
/* Hidden class */
.hidden {
  display: none !important;
}
.text-red {
  color: #ff4757;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
