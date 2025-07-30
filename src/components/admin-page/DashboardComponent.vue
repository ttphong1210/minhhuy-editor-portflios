<template>
  <div id="dashboard">
    <!-- Sidebar -->
    <div
      class="sidebar"
      :class="{ open: sidebarOpen, mobile: isMobile }"
      @click.self="isMobile && closeSidebar"
    >
      <div class="sidebar-header">
        <h2><i class="fas fa-briefcase"></i> Portfolio</h2>
        <p>Admin Dashboard</p>
      </div>
      <ul class="sidebar-menu">
        <li class="menu-item" v-for="item in menuItems" :key="item.tab">
          <a
            href="#"
            class="menu-link"
            :class="{ active: activeTab === item.tab }"
            @click.prevent="selectTab(item.tab)"
          >
            <i :class="item.icon"></i>
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen && isMobile"
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header">
        <div style="display: flex; align-items: center; gap: 20px">
          <button
            class="btn btn-secondary hamburger"
            @click="openSidebar"
            v-if="isMobile"
          >
            <i class="fas fa-bars"></i>
          </button>
          <h1 class="header-title">{{ getPageTitle() }}</h1>
        </div>
        <div class="header-actions">
          <button
            class="btn btn-primary"
            @click="openModal('create')"
            v-if="activeTab === 'projects'"
          >
            <i class="fas fa-plus"></i>
            Thêm dự án mới
          </button>
          <button
            class="btn btn-primary"
            @click="openModalCategory('create-category')"
            v-if="activeTab === 'categories'"
          >
            <i class="fas fa-plus"></i>
            Thêm danh mục mới
          </button>
          <button
            class="btn btn-primary"
            @click="openModalServices('create-service')"
            v-if="activeTab === 'services'"
          >
            <i class="fas fa-plus"></i>
            Thêm dịch vụ mới
          </button>
          <button
            class="btn btn-primary"
            @click="openModalSection('create-sections')"
            v-if="activeTab === 'sections'"
          >
            <i class="fas fa-plus"></i>
            Thêm sections mới
          </button>
          <button
            class="btn btn-primary"
            @click="openModalAbout('create-about')"
            v-if="activeTab === 'about'"
          >
            <i class="fas fa-plus"></i>
            Thêm thông tin mới
          </button>
          <div class="user-dropdown-wrapper">
            <div class="user-info">
              <i class="fas fa-user"></i> {{ user ? user.name : "Khách" }}
            </div>
            <div class="dropdown-menu" v-if="user">
              <a href="#" @click.prevent="logout">Đăng xuất</a>
            </div>
          </div>
          <!-- <div style="color: #666; font-size: 14px">
          <i class="fas fa-user"></i> {{ user ? user.name : "Khách" }}
        </div> -->
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        <!-- Alert -->
        <div v-if="alert.show" class="alert" :class="alert.type">
          <i
            class="fas"
            :class="
              alert.type === 'alert-success'
                ? 'fa-check-circle'
                : 'fa-exclamation-circle'
            "
          ></i>
          {{ alert.message }}
        </div>

        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'">
          <div class="stats-grid">
            <div class="stat-card projects">
              <div class="stat-number">{{ filterProjects.length }}</div>
              <div class="stat-label">Tổng dự án</div>
              <i class="fas fa-project-diagram stat-icon"></i>
            </div>
            <div class="stat-card categories">
              <div class="stat-number">{{ filterCategories.length }}</div>
              <div class="stat-label">Danh mục</div>
              <i class="fas fa-tags stat-icon"></i>
            </div>
            <div class="stat-card services">
              <div class="stat-number">{{ filterServices.length }}</div>
              <div class="stat-label">Dịch vụ</div>
              <i class="fas fa-concierge-bell stat-icon"></i>
            </div>
            <div class="stat-card views">
              <div class="stat-number">{{ getTotalViews() }}</div>
              <div class="stat-label">Lượt xem</div>
              <i class="fas fa-eye stat-icon"></i>
            </div>
          </div>

          <!-- Recent Projects -->
          <div class="table-container">
            <div class="table-header">
              <h3 class="table-title">Dự án gần đây</h3>
              <button class="btn btn-primary" @click="activeTab = 'projects'">
                Xem tất cả
              </button>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Dự án</th>
                  <th>Danh mục</th>
                  <th>Ngày tạo</th>
                  <th>Lượt xem</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="project in filterProjects.slice(0, 5)"
                  :key="project.id"
                >
                  <td>
                    <div style="display: flex; align-items: center; gap: 15px">
                      <img
                        :src="project.thumbnail"
                        :alt="project.title"
                        class="project-image"
                      />
                      <div>
                        <div class="project-title">{{ project.title }}</div>
                        <div class="project-description">
                          {{ project.description }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ getCategoryName(project.category_id) }}</td>
                  <td>{{ formatDate(project.created_at) }}</td>
                  <td>{{ project.views }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Projects Tab -->
        <div v-if="activeTab === 'projects'">
          <div class="table-container">
            <div class="table-header">
              <h3 class="table-title">Quản lý dự án</h3>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm dự án..."
                  v-model="searchQuery"
                />
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Dự án</th>
                  <th>Danh mục</th>
                  <th>Ngày tạo</th>
                  <th>Lượt xem</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="project in filterProjects" :key="project.id">
                  <td>
                    <div style="display: flex; align-items: center; gap: 15px">
                      <img
                        :src="project.thumbnail"
                        :alt="project.title"
                        class="project-image"
                      />
                      <div>
                        <div class="project-title">{{ project.title }}</div>
                        <div class="project-description">
                          {{ project.description }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{{ getCategoryName(project.category_id) }}</td>
                  <td>{{ formatDate(project.created_at) }}</td>
                  <td>{{ project.views }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-warning btn-sm"
                        @click="openModal('edit', project)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteProject(project.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Categories Tab -->
        <div v-if="activeTab === 'categories'">
          <div class="table-container">
            <div class="table-header">
              <h3 class="table-title">Quản lý danh mục</h3>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm danh mục..."
                  v-model="searchQuery"
                />
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th>Image</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="cate in filterCategories" :key="cate.id">
                  <td>
                    <div class="category-name">{{ cate.name }}</div>
                  </td>
                  <td>
                    <div class="category-description">
                      {{ cate.description }}
                    </div>
                  </td>
                  <td>
                    <img
                      style="width: 100%"
                      :src="getImageURL(cate.image)"
                      :alt="cate.name"
                      class="category-image"
                    />
                  </td>
                  <td>{{ formatDate(cate.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-warning btn-sm"
                        @click="openModalCategory('edit-category', cate)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteCategory(cate.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Services Tab -->
        <div v-if="activeTab === 'services'">
          <div class="table-container">
            <div class="table-header">
              <h3 class="table-title">Quản lý dịch vụ</h3>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm danh mục..."
                  v-model="searchQuery"
                />
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Tiêu đề dịch vụ</th>
                  <th>Mô tả</th>
                  <th>Icon</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in filterServices" :key="service.id">
                  <td>
                    <div class="service-name">{{ service.title }}</div>
                  </td>
                  <td>
                    <div class="service-description">
                      {{ service.description }}
                    </div>
                  </td>
                  <td>
                    <img
                      style="width: 30%"
                      :src="getImageURL(service.icon)"
                      :alt="service.name"
                      class="service-image"
                    />
                  </td>
                  <td>{{ formatDate(service.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-warning btn-sm"
                        @click="openModalServices('edit-service', service)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteService(service.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sections Tab -->
        <div v-if="activeTab === 'sections'">
          <div class="table-container">
            <div class="table-header">
              <h3 class="table-title">Quản lý sections</h3>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm sections..."
                  v-model="searchQuery"
                />
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Tiêu đề section</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="section in filterSections" :key="section.id">
                  <td>
                    <div class="service-name">{{ section.title }}</div>
                  </td>
                  <td>
                    <div class="service-description">
                      {{ section.description }}
                    </div>
                  </td>
                  <td>{{ formatDate(section.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-warning btn-sm"
                        @click="openModalSection('edit-sections', section)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteSection(section.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- About Tab -->
        <div v-if="activeTab === 'about'">
          <div class="table-container">
            <div class="table-header">
              <h3 class="table-title">Quản lý thông tin</h3>
              <div class="search-box">
                <i class="fas fa-search search-icon"></i>
                <input
                  type="text"
                  class="search-input"
                  placeholder="Tìm kiếm thông tin..."
                  v-model="searchQuery"
                />
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Tiêu đề thông tin</th>
                  <th>Mô tả</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="about in filterAbout" :key="about.id">
                  <td>
                    <div class="service-name">{{ about.title }}</div>
                  </td>
                  <td>
                    <div class="service-description">
                      {{ about.description }}
                    </div>
                  </td>
                  <td>{{ formatDate(about.created_at) }}</td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-warning btn-sm"
                        @click="openModalAbout('edit-about', about)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="deleteAbout(about.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'">
          <div style="text-align: center; padding: 50px; color: #666">
            <i
              class="fas fa-cog"
              style="font-size: 64px; margin-bottom: 20px"
            ></i>
            <h3>Cài đặt hệ thống</h3>
            <p>Chức năng đang phát triển</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Project -->
    <div v-if="modal.show" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            {{ modal.mode === "create" ? "Thêm dự án mới" : "Chỉnh sửa dự án" }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: langTab === 'vi' }"
              @click="langTab = 'vi'"
            >
              Tiếng Việt
            </button>
            <button
              class="tab"
              :class="{ active: langTab === 'en' }"
              @click="langTab = 'en'"
            >
              English
            </button>
          </div>

          <!-- Tiếng Việt -->
          <div v-if="langTab === 'vi'">
            <div class="form-group">
              <label class="form-label">Tiêu đề dự án *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_vi.title"
                placeholder="Nhập tiêu đề dự án"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả ngắn *</label>
              <textarea
                class="form-textarea"
                v-model="form_vi.description"
                placeholder="Mô tả ngắn về dự án"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Danh mục *</label>
                <select class="form-select" v-model="form_vi.category_id">
                  <option value="">Chọn danh mục</option>
                  <option
                    v-for="category in filterCategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Loại video</label>
                <select class="form-select" v-model="form_vi.video_type">
                  <option value="">Chọn loại video</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Link chi tiết</label>
                <input
                  type="url"
                  class="form-input"
                  v-model="form_vi.video_url"
                  placeholder="Nhập link chi tiết"
                />
              </div>
            </div>
          </div>

          <!-- Tiếng Anh -->
          <div v-if="langTab === 'en'">
            <div class="form-group">
              <label class="form-label">Title (English) *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_en.title"
                placeholder="Enter title project"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Short Description (English) *</label>
              <textarea
                class="form-textarea"
                v-model="form_en.description"
                placeholder="Enter short description project"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Category *</label>
                <select class="form-select" v-model="form_en.category_id">
                  <option value="">Select Category</option>
                  <option
                    v-for="category in filterCategoriesEn"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Video Type</label>
                <select class="form-select" v-model="form_en.video_type">
                  <option value="">Select video type</option>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="driver">Driver</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Link</label>
                <input
                  type="url"
                  class="form-input"
                  v-model="form_en.video_url"
                  placeholder="Enter link"
                />
              </div>
            </div>
          </div>

          <button
            class="btn btn-primary"
            @click="
              modal.mode === 'create'
                ? actionCreateProject()
                : actionUpdateProject(form_vi.id)
            "
          >
            {{ modal.mode === "create" ? "Lưu dự án" : "Cập nhật dự án" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Category-->
    <div
      v-if="modal_category.show"
      class="modal-overlay"
      @click.self="closeCategoryModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            {{
              modal_category.mode_category === "create-category"
                ? "Thêm danh mục mới"
                : "Chỉnh sửa danh mục"
            }}
          </h3>
          <button class="modal-close" @click="closeCategoryModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: langTab === 'vi' }"
              @click="langTab = 'vi'"
            >
              Tiếng Việt
            </button>
            <button
              class="tab"
              :class="{ active: langTab === 'en' }"
              @click="langTab = 'en'"
            >
              English
            </button>
          </div>

          <!-- Tiếng Việt -->
          <div v-if="langTab === 'vi'">
            <div class="form-group">
              <label class="form-label">Tiêu đề danh mục *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_category_vi.name"
                placeholder="Nhập tiêu đề danh mục"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả ngắn *</label>
              <textarea
                class="form-textarea"
                v-model="form_category_vi.description"
                placeholder="Mô tả ngắn về danh mục"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                class="form-input"
                @change="handleFileUpload"
              />
            </div>
            <div v-if="form_category_vi.image">
              <img
                :src="
                  modal_category.mode_category === 'edit-category'
                    ? getImageURL(form_category_vi.image)
                    : getPreviewImage(form_category_vi.image)
                "
                alt="Preview"
                style="max-width: 150px"
              />
            </div>
          </div>

          <!-- Tiếng Anh -->
          <div v-if="langTab === 'en'">
            <div class="form-group">
              <label class="form-label">Title (English) *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_category_en.name"
                placeholder="Enter category title"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Short Description (English) *</label>
              <textarea
                class="form-textarea"
                v-model="form_category_en.description"
                placeholder="Short description of category"
              ></textarea>
            </div>
            <div v-if="form_category_vi.image">
              <img
                :src="
                  modal_category.mode_category === 'edit-category'
                    ? getImageURL(form_category_vi.image)
                    : getPreviewImage(form_category_vi.image)
                "
                alt="Preview"
                style="max-width: 150px"
              />
            </div>
          </div>

          <button
            class="btn btn-primary"
            @click="
              modal_category.mode_category === 'create-category'
                ? actionAddCategory()
                : actionUpdateCategory(form_category_vi.id)
            "
          >
            {{
              modal_category.mode_category === "create-category"
                ? "Thêm danh mục"
                : "Cập nhật danh mục"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Services -->
    <div
      v-if="modal_services.show"
      class="modal-overlay"
      @click.self="closeServicesModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            {{
              modal_services.mode_services === "create-service"
                ? "Thêm dịch vụ mới"
                : "Chỉnh sửa dịch vụ"
            }}
          </h3>
          <button class="modal-close" @click="closeServicesModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: langTab === 'vi' }"
              @click="langTab = 'vi'"
            >
              Tiếng Việt
            </button>
            <button
              class="tab"
              :class="{ active: langTab === 'en' }"
              @click="langTab = 'en'"
            >
              English
            </button>
          </div>

          <!-- Tiếng Việt -->
          <div v-if="langTab === 'vi'">
            <div class="form-group">
              <label class="form-label">Tiêu đề danh mục *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_services_vi.title"
                placeholder="Nhập tiêu đề dịch vụ"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả ngắn *</label>
              <textarea
                class="form-textarea"
                v-model="form_services_vi.description"
                placeholder="Mô tả ngắn về dịch vụ"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Icon</label>
              <input
                type="file"
                accept="image/*"
                class="form-input"
                @change="handleIconUpload"
              />
            </div>
            <div v-if="form_services_vi.icon">
              <img
                :src="
                  modal_services.mode_services === 'edit-service'
                    ? getImageURL(form_services_vi.icon)
                    : getPreviewImage(form_services_vi.icon)
                "
                alt="Preview"
                style="max-width: 150px"
              />
            </div>
          </div>

          <!-- Tiếng Anh -->
          <div v-if="langTab === 'en'">
            <div class="form-group">
              <label class="form-label">Title (English) *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_services_en.title"
                placeholder="Enter services title"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Short Description (English) *</label>
              <textarea
                class="form-textarea"
                v-model="form_services_en.description"
                placeholder="Short description of services"
              ></textarea>
            </div>
            <div v-if="form_services_vi.icon">
              <img
                :src="
                  modal_services.mode_services === 'edit-service'
                    ? getImageURL(form_services_vi.icon)
                    : getPreviewImage(form_services_vi.icon)
                "
                alt="Preview"
                style="max-width: 150px"
              />
            </div>
          </div>
          <button
            class="btn btn-primary"
            @click="
              modal_services.mode_services === 'create-service'
                ? actionAddService()
                : actionUpdateService(form_services_vi.id)
            "
          >
            {{
              modal_services.mode_services === "create-service"
                ? "Thêm dịch vụ"
                : "Cập nhật dịch vụ"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Sections -->
    <div
      v-if="modal_sections.show"
      class="modal-overlay"
      @click.self="closeSectionsModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            {{
              modal_sections.mode_sections === "create-sections"
                ? "Thêm sections mới"
                : "Chỉnh sửa sections"
            }}
          </h3>
          <button class="modal-close" @click="closeSectionsModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: langTab === 'vi' }"
              @click="langTab = 'vi'"
            >
              Tiếng Việt
            </button>
            <button
              class="tab"
              :class="{ active: langTab === 'en' }"
              @click="langTab = 'en'"
            >
              English
            </button>
          </div>

          <div v-if="langTab === 'vi'">
            <div class="form-group">
              <label class="form-label">Tiêu đề section *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_section_vi.title"
                placeholder="Nhập tiêu đề section"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả ngắn *</label>
              <textarea
                class="form-textarea"
                v-model="form_section_vi.description"
                placeholder="Mô tả ngắn về section"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Trạng thái *</label>
              <select class="form-select" v-model="form_section_vi.status">
                <option value="">Chọn trạng thái</option>
                <option value="active">Hiển thị</option>
                <option value="unactive">Ẩn</option>
              </select>
            </div>
          </div>

          <!-- English -->
          <div v-if="langTab === 'en'">
            <div class="form-group">
              <label class="form-label">Title (English) *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_section_en.title"
                placeholder="Enter section title"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Short Description (English)</label>
              <textarea
                class="form-textarea"
                v-model="form_section_en.description"
                placeholder="Short description of section"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Status *</label>
              <select class="form-select" v-model="form_section_en.status">
                <option value="">Select status</option>
                <option value="active">Visible</option>
                <option value="unactive">Hidden</option>
              </select>
            </div>
          </div>

          <!-- Submit -->
          <button
            class="btn btn-primary"
            @click="
              modal_sections.mode_sections === 'create-sections'
                ? actionAddSections()
                : actionUpdateSections(form_section_vi.id)
            "
          >
            {{
              modal_sections.mode_sections === "create-sections"
                ? "Thêm sections"
                : "Cập nhật sections"
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal About -->
    <div
      v-if="modal_about.show"
      class="modal-overlay"
      @click.self="closeAboutModal"
    >
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">
            {{
              modal_about.mode_about === "create-about"
                ? "Thêm thông tin mới"
                : "Chỉnh sửa thông tin"
            }}
          </h3>
          <button class="modal-close" @click="closeAboutModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs">
            <button
              class="tab"
              :class="{ active: langTab === 'vi' }"
              @click="langTab = 'vi'"
            >
              Tiếng Việt
            </button>
            <button
              class="tab"
              :class="{ active: langTab === 'en' }"
              @click="langTab = 'en'"
            >
              English
            </button>
          </div>

          <div v-if="langTab === 'vi'">
            <div class="form-group">
              <label class="form-label">Tiêu đề thông tin *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_about_vi.title"
                placeholder="Nhập tiêu đề thông tin"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Mô tả ngắn *</label>
              <textarea
                class="form-textarea"
                v-model="form_about_vi.description"
                placeholder="Mô tả ngắn về bản thân"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Trạng thái *</label>
              <select class="form-select" v-model="form_about_vi.status">
                <option value="">Chọn trạng thái</option>
                <option value="active">Hiển thị</option>
                <option value="unactive">Ẩn</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                class="form-input"
                @change="handleFileAvatarUpload"
              />
            </div>
            <div v-if="form_about_vi.avatar">
              <img
                :src="
                  modal_about.mode_about === 'edit-about'
                    ? getImageURL(form_about_vi.avatar)
                    : getPreviewImage(form_about_vi.avatar)
                "
                alt="Preview"
                style="max-width: 150px"
              />
            </div>
          </div>

          <!-- English -->
          <div v-if="langTab === 'en'">
            <div class="form-group">
              <label class="form-label">Title (English) *</label>
              <input
                type="text"
                class="form-input"
                v-model="form_about_en.title"
                placeholder="Enter about title"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Short Description (English)</label>
              <textarea
                class="form-textarea"
                v-model="form_about_en.description"
                placeholder="Short description of information"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Status *</label>
              <select class="form-select" v-model="form_about_en.status">
                <option value="">Select status</option>
                <option value="active">Visible</option>
                <option value="unactive">Hidden</option>
              </select>
            </div>
            <div v-if="form_about_en.avatar">
              <img
                :src="
                  modal_about.mode_about === 'edit-about'
                    ? getImageURL(form_about_en.avatar)
                    : getPreviewImage(form_about_en.avatar)
                "
                alt="Preview"
                style="max-width: 150px"
              />
            </div>
          </div>

          <!-- Submit -->
          <button
            class="btn btn-primary"
            @click="
              modal_about.mode_about === 'create-about'
                ? actionAddAbout()
                : actionUpdateAbout(form_about_vi.id)
            "
          >
            {{
              modal_about.mode_about === "create-about"
                ? "Thêm thông tin"
                : "Cập nhật thông tin"
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAbout } from "@/service/aboutService";
import api from "@/utils/axios.js";
import { getImageURL } from "@/utils/imageHelper";

export default {
  data() {
    return {
      langTab: "vi",
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
      sidebarOpen: true,
      isMobile: false,
      activeTab: "dashboard",
      menuItems: [
        { tab: "dashboard", label: "Dashboard", icon: "fas fa-tachometer-alt" },
        { tab: "projects", label: "Dự án", icon: "fas fa-project-diagram" },
        { tab: "categories", label: "Danh mục", icon: "fas fa-tags" },
        { tab: "services", label: "Dịch vụ", icon: "fas fa-concierge-bell" },
        { tab: "sections", label: "Sections", icon: "fas fa-file-alt" },
        { tab: "about", label: "Abouts", icon: "fas fa-id-badge	" },
        { tab: "settings", label: "Cài đặt", icon: "fas fa-cog" },
      ],
      alert: {
        show: false,
        type: "",
        message: "",
      },
      modal: {
        show: false,
        mode: "create",
        project: null,
      },
      modal_category: {
        show: false,
        mode_category: "create-category",
        category: null,
      },
      modal_services: {
        show: false,
        mode_services: "create-service",
        service: null,
      },
      modal_sections: {
        show: false,
        mode_sections: "create-sections",
        sections: null,
      },
      modal_about: {
        show: false,
        mode_about: "create-about",
        abouts: null,
      },
      form_vi: {
        title: "",
        description: "",
        category_id: "",
        video_url: "",
        video_type: "",
      },
      form_en: {
        title: "",
        description: "",
        category_id: "",
        video_url: "",
        video_type: "",
      },
      form_category_vi: {
        name: "",
        description: "",
        image: "",
      },
      form_category_en: {
        name: "",
        description: "",
        image: "",
      },
      form_services_vi: {
        title: "",
        description: "",
        icon: "",
      },
      form_services_en: {
        title: "",
        description: "",
        icon: "",
      },
      form_section_vi: {
        title: "",
        description: "",
        status: "",
      },
      form_section_en: {
        title: "",
        description: "",
        status: "",
      },
      form_about_vi: {
        title: "",
        description: "",
        avatar: "",
        status: "",
      },
      form_about_en: {
        title: "",
        description: "",
        avatar: "",
        status: "",
      },
      searchQuery: "",
      projects: [],
      filterProjects: [],
      services: [],
      filterServices: [],
      categories: [],
      filterCategories: [],
      filterCategoriesEn: [],
      sections: [],
      filterSections: [],
      about: [],
      filterAbout: [],
    };
  },
  async created() {
    this.about = await fetchAbout();
    this.filterAbout = this.about.filter((a) => a.lang_code === "vi");
  },
  mounted() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    this.fetchCategories();
    this.fetchProjects();
    this.fetchServices();
    this.fetchSections();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    getImageURL,
    handleResize() {
      this.isMobile = window.innerWidth <= 1024;
      if (this.isMobile) this.sidebarOpen = false;
      else this.sidebarOpen = true;
    },
    openModal(mode, project = null) {
      this.modal.show = true;
      this.modal.mode = mode;
      if (mode === "edit" && project) {
        const projects = this.projects;
        const viProject = projects.find(
          (p) => p.id === project.id && p.lang_code === "vi"
        );
        const enProject = projects.find(
          (p) => p.translation_id === project.id && p.lang_code === "en"
        );
        this.form_vi = { ...viProject };
        this.form_en = { ...enProject };
      } else {
        this.form_vi = {
          title: "",
          description: "",
          categoryId: "",
          video_type: "",
          video_url: "",
        };
        this.form_vi = {
          title: "",
          description: "",
          categoryId: "",
          video_type: "",
          video_url: "",
        };
      }
    },
    openModalCategory(mode_category, category = null) {
      this.modal_category.show = true;
      this.modal_category.mode_category = mode_category;
      if (mode_category === "edit-category" && category) {
        const categories = this.categories;
        const viCategory = categories.find(
          (c) => c.id === category.id && c.lang_code === "vi"
        );
        const enCategory = categories.find(
          (c) => c.lang_code === "en" && c.translation_id === category.id
        );
        this.form_category_vi = { ...viCategory };
        this.form_category_en = { ...enCategory };
      } else {
        this.form_category_vi = {
          name: "",
          description: "",
          image: "",
        };
        this.form_category_en = {
          name: "",
          description: "",
          image: "",
        };
      }
    },
    openModalServices(mode_services, service = null) {
      this.modal_services.show = true;
      this.modal_services.mode_services = mode_services;
      if (mode_services === "edit-service" && service) {
        const services = this.services;
        const viService = services.find(
          (s) => s.id === service.id && s.lang_code === "vi"
        );
        const enService = services.find(
          (s) => s.lang_code === "en" && s.translation_id === service.id
        );
        this.form_services_vi = { ...viService };
        this.form_services_en = { ...enService };
      } else {
        this.form_services_vi = {
          title: "",
          description: "",
          icon: "",
        };
        this.form_services_en = {
          title: "",
          description: "",
          icon: "",
        };
      }
    },
    openModalSection(mode_sections, section = null) {
      this.modal_sections.show = true;
      this.modal_sections.mode_sections = mode_sections;
      if (mode_sections === "edit-sections" && section) {
        const sections = this.sections;
        const viSection = sections.find(
          (s) => s.id === section.id && s.lang_code === "vi"
        );
        const enSection = sections.find(
          (s) => s.lang_code === "en" && s.translation_id === section.id
        );
        this.form_section_vi = { ...viSection };
        this.form_section_en = { ...enSection };
      } else {
        this.form_section_vi = {
          title: "",
          description: "",
          status: "",
        };
        this.form_section_en = {
          title: "",
          description: "",
          status: "",
        };
      }
    },
    openModalAbout(mode_about, about = null) {
      this.modal_about.show = true;
      this.modal_about.mode_about = mode_about;
      if (mode_about === "edit-about" && about) {
        const abouts = this.about ;
        const viAbout = abouts.find(
          (a) => a.id === about.id && a.lang_code === "vi"
        );
        const enAbout = abouts.find(
          (a) => a.lang_code === "en" && a.translation_id === about.id
        );
        this.form_about_vi = { ...viAbout };
        this.form_about_en = { ...enAbout };
      } else {
        this.form_about_vi = {
          title: "",
          description: "",
          avatar: "",
          status: "",
        };
        this.form_about_en = {
          title: "",
          description: "",
          avatar: "",
          status: "",
        };
      }
    },
    closeModal() {
      this.modal.show = false;
    },
    closeCategoryModal() {
      this.modal_category.show = false;
    },
    closeServicesModal() {
      this.modal_services.show = false;
    },
    closeSectionsModal() {
      this.modal_sections.show = false;
    },
    closeAboutModal() {
      this.modal_about.show = false;
    },
    getPageTitle() {
      switch (this.activeTab) {
        case "dashboard":
          return "Dashboard";
        case "projects":
          return "Quản lý dự án";
        case "categories":
          return "Quản lý danh mục";
        case "services":
          return "Quản lý dịch vụ";
        case "sections":
          return "Quản lý sections";
        case "about":
          return "Quản lý thông tin";
        case "settings":
          return "Cài đặt hệ thống";
        default:
          return "";
      }
    },
    getCategoryName(id) {
      const category = this.categories.find((cat) => cat.id === id);
      return category ? category.name : "Không xác định";
    },
    async fetchCategories() {
      try {
        const response = await api.get("categories");
        this.categories = response.data;
        this.filterCategories = this.categories.filter(
          (c) => c.lang_code === "vi"
        );
        this.filterCategoriesEn = this.categories.filter(
          (c) => c.lang_code === "en"
        );
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    },
    async actionAddCategory() {
      try {
        const formData = new FormData();
        formData.append("category[0][name]", this.form_category_vi.name);
        formData.append(
          "category[0][description]",
          this.form_category_vi.description
        );
        if (this.form_category_vi.image instanceof File) {
          formData.append("category[0][image]", this.form_category_vi.image);
        }
        formData.append("category[0][lang_code]", "vi");

        formData.append("category[1][name]", this.form_category_en.name);
        formData.append(
          "category[1][description]",
          this.form_category_en.description
        );
        formData.append("category[1][lang_code]", "en");

        const newCategory = await api.post("categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.categories.push(newCategory.data);
        this.closeCategoryModal();
        this.fetchCategories();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Danh mục đã được thêm thành công!",
        };
      } catch (e) {
        console.error("Error adding category:", e);
      }
    },
    async actionUpdateCategory(cate_id) {
      try {
        const formData = new FormData();
        formData.append("category[0][id]", this.form_category_vi.id);
        formData.append("category[0][name]", this.form_category_vi.name);
        formData.append(
          "category[0][description]",
          this.form_category_vi.description
        );
        if (this.form_category_vi.image instanceof File) {
          formData.append("category[0][image]", this.form_category_vi.image);
        }
        formData.append("category[0][lang_code]", "vi");

        formData.append("category[1][id]", this.form_category_en.id);
        formData.append("category[1][name]", this.form_category_en.name);
        formData.append(
          "category[1][description]",
          this.form_category_en.description
        );
        formData.append("category[1][image]", this.form_category_vi.image);
        formData.append("category[1][lang_code]", "en");

        const updatedCategory = await api.post(
          `categories/${cate_id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const index = this.categories.findIndex(
          (cat) => cat.id === updatedCategory.id
        );
        if (index !== -1) {
          this.categories.splice(index, 1, updatedCategory);
        }
        this.closeCategoryModal();
        this.fetchCategories();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Danh mục đã được cập nhật thành công!",
        };
      } catch (e) {
        console.error("Error updating category:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi câp nhật danh mục. Vui lòng thử lại.",
        };
      }
    },
    async deleteCategory(cate_id) {
      try {
        await api.delete(`categories/${cate_id}`);
        this.categories = this.categories.filter((cat) => cat.id !== cate_id);
        this.fetchCategories();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Danh mục đã được xóa thành công!",
        };
      } catch (e) {
        console.error("Error deleting category:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi xóa danh mục. Vui lòng thử lại.",
        };
      }
    },
    async fetchProjects() {
      try {
        const response = await api.get("portfolios");
        this.projects = response.data;
        this.filterProjects = this.projects.filter((p) => p.lang_code === "vi");
      } catch (e) {
        console.error("Error fetching projects:", e);
      }
    },
    async actionCreateProject() {
      const categoryVi = this.categories.find(
        (c) => c.id === this.form_vi.category_id
      );
      const categoryEn = this.categories.find(
        (c) => c.lang_code === "en" && c.translation_id === categoryVi.id
      );
      if (!this.form_vi.title || !this.form_vi.category_id) {
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Vui lòng điền đầy đủ thông tin tiếng Việt",
        };
        return;
      }

      if (!this.form_en.title || !this.form_en.category_id) {
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Vui lòng điền đầy đủ thông tin tiếng Anh",
        };
        return;
      }
      try {
        const formData = new FormData();
        // Data category Viet
        formData.append("project[0][title]", this.form_vi.title);
        formData.append("project[0][description]", this.form_vi.description);
        formData.append("project[0][category_id]", categoryVi.id);
        formData.append("project[0][video_url]", this.form_vi.video_url);
        formData.append("project[0][video_type]", this.form_vi.video_type);
        formData.append("project[0][lang_code]", "vi");

        // Data category English
        formData.append("project[1][title]", this.form_en.title);
        formData.append("project[1][description]", this.form_en.description);
        formData.append("project[1][category_id]", categoryEn.id);
        formData.append("project[1][video_url]", this.form_en.video_url);
        formData.append("project[1][video_type]", this.form_en.video_type);
        formData.append("project[1][lang_code]", "en");

        const newProject = await api.post("portfolios", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.projects.push(newProject.data);
        this.closeModal();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Dự án đã được tạo thành công!",
        };
        this.fetchProjects();
        this.form_vi = {
          title: "",
          description: "",
          category_id: "",
          video_url: "",
          video_type: "",
        };
        this.form_en = {
          title: "",
          description: "",
          category_id: "",
          video_url: "",
          video_type: "",
        };
      } catch (e) {
        console.error("Error creating project:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi tạo dự án. Vui lòng thử lại.",
        };
      }
    },

    async actionUpdateProject(project_id) {
      try {
        const formData = new FormData();
        formData.append("project[0][id]", this.form_vi.id);
        formData.append("project[0][title]", this.form_vi.title);
        formData.append("project[0][description]", this.form_vi.description);
        formData.append("project[0][category_id]", this.form_vi.category_id);
        formData.append("project[0][video_url]", this.form_vi.video_url);
        formData.append("project[0][video_type]", this.form_vi.video_type);
        formData.append("project[0][lang_code]", "vi");

        formData.append("project[1][id]", this.form_en.id);
        formData.append("project[1][title]", this.form_en.title);
        formData.append("project[1][description]", this.form_en.description);
        formData.append("project[1][category_id]", this.form_en.category_id);
        formData.append("project[1][video_url]", this.form_en.video_url);
        formData.append("project[1][video_type]", this.form_en.video_type);
        formData.append("project[1][lang_code]", "en");

        const updatedProject = await api.post(
          `portfolios/${project_id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const index = this.projects.findIndex(
          (proj) => proj.id === updatedProject.id
        );
        if (index !== -1) {
          this.projects.splice(index, 1, updatedProject);
        }
        this.fetchProjects();
        this.closeModal();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Dự án đã được cập nhật thành công!",
        };
      } catch (e) {
        console.error("Error updating project:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi cập nhật dự án. Vui lòng thử lại.",
        };
      }
    },
    async deleteProject(project_id) {
      try {
        await api.delete(`portfolios/${project_id}`);
        this.projects = this.projects.filter((proj) => proj.id !== project_id);
        this.fetchProjects();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Dự án đã được xóa thành công!",
        };
      } catch (e) {
        console.error("Error deleting project:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi xóa dự án. Vui lòng thử lại.",
        };
      }
    },
    async fetchServices() {
      try {
        const response = await api.get("services");
        this.services = response.data;
        this.filterServices = this.services.filter((s) => s.lang_code === "vi");
      } catch (e) {
        console.error("Error fetching services:", e);
      }
    },
    async actionAddService() {
      const formData = new FormData();
      formData.append("services[0][title]", this.form_services_vi.title);
      formData.append(
        "services[0][description]",
        this.form_services_vi.description
      );
      formData.append("services[0][lang_code]", "vi");
      if (this.form_services_vi.icon instanceof File) {
        formData.append("services[0][icon]", this.form_services_vi.icon);
      }

      formData.append("services[1][title]", this.form_services_en.title);
      formData.append(
        "services[1][description]",
        this.form_services_en.description
      );
      formData.append("services[1][lang_code]", "en");
      try {
        const response = await api.post("services", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.services.push(response.data);
        this.closeServicesModal();
        this.fetchServices();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Thêm dịch vụ thành công",
        };
      } catch (e) {
        console.error("Error adding service:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi thêm dịch vụ. Vui lòng thử lại.",
        };
      }
    },
    async actionUpdateService(service_id) {
      const formData = new FormData();

      formData.append("services[0][id]", this.form_services_vi.id);
      formData.append("services[0][title]", this.form_services_vi.title);
      formData.append(
        "services[0][description]",
        this.form_services_vi.description
      );
      formData.append("services[0][lang_code]", "vi");
      if (this.form_services_vi.icon instanceof File) {
        formData.append("services[0][icon]", this.form_services_vi.icon);
      }

      formData.append("services[1][id]", this.form_services_en.id);
      formData.append("services[1][title]", this.form_services_en.title);
      formData.append(
        "services[1][description]",
        this.form_services_en.description
      );
      formData.append("services[1][lang_code]", "en");
      if (this.form_services_en.icon instanceof File) {
        formData.append("services[1][icon]", this.form_services_en.icon);
      }

      try {
        const response = await api.post(
          `services/${service_id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const index = this.services.findIndex(
          (service) => service.id === response.data.id
        );
        if (index !== -1) {
          this.services.splice(index, 1, response.data);
        }
        this.closeServicesModal();
        this.fetchServices();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Cập nhật dịch vụ thành công.",
        };
      } catch (e) {
        console.error("Error updating service:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi cập nhật dịch vụ. Vui lòng thử lại.",
        };
      }
    },
    async deleteService(service_id) {
      try {
        await api.delete(`services/${service_id}`);
        this.services = this.services.filter(
          (service) => service.id !== service_id
        );
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Dịch vụ đã được xóa thành công!",
        };
      } catch (e) {
        console.error("Error deleting service:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi xóa dịch vụ. Vui lòng thử lại.",
        };
      }
    },
    async fetchSections() {
      try {
        const response = await api.get("sections");
        this.sections = response.data.sections;
        this.filterSections = this.sections.filter((s) => s.lang_code === "vi");
      } catch (e) {
        console.error("Error fetching projects:", e);
      }
    },
    async actionAddSections() {
      const formData = new FormData();
      formData.append("sections[0][title]", this.form_section_vi.title);
      formData.append(
        "sections[0][description]",
        this.form_section_vi.description
      );
      formData.append("sections[0][status]", this.form_section_vi.status);
      formData.append("sections[0][lang_code]", "vi");

      formData.append("sections[1][title]", this.form_section_en.title);
      formData.append(
        "sections[1][description]",
        this.form_section_en.description
      );
      formData.append("sections[1][status]", this.form_section_en.status);
      formData.append("sections[1][lang_code]", "en");
      try {
        const response = await api.post("sections", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          this.sections.push(response.data.sections);
          this.closeSectionsModal();
          this.fetchSections();
        }
      } catch (e) {
        console.error("Error adding service:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi thêm section. Vui lòng thử lại.",
        };
      }
    },
    async actionUpdateSections(sections_id) {
      const payload = [
        {
          id: this.form_section_vi.id,
          title: this.form_section_vi.title,
          description: this.form_section_vi.description,
          status: this.form_section_vi.status,
          lang_code: "vi",
        },
        {
          id: this.form_section_en.id,
          title: this.form_section_en.title,
          description: this.form_section_en.description,
          status: this.form_section_en.status,
          lang_code: "en",
        },
      ];
      try {
        const response = await api.post(
          `sections/${sections_id}?_method=PUT`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data.success && response.data.section) {
          const index = this.sections.findIndex(
            (section) => section.id === response.data.section.id
          );
          if (index !== -1) {
            this.sections.splice(index, 1, response.data.section);
          }
        }
        this.closeSectionsModal();
        this.fetchSections();

        this.form_section_vi = {
          title: "",
          description: "",
          status: "active",
        };
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Cập nhật sections thành công !",
        };
      } catch (e) {
        console.error("Error updating sections:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi cập nhật sections. Vui lòng thử lại.",
        };
      }
    },
    async deleteSection(sections_id) {
      try {
        await api.delete(`sections/${sections_id}`);
        this.fetchSections();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Sections đã được xóa thành công!",
        };
      } catch (e) {
        console.error("Error deleting service:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi xóa sections. Vui lòng thử lại.",
        };
      }
    },

    async actionAddAbout() {
      const formData = new FormData();
      // Thêm dữ liệu tiếng Việt
      formData.append("about[0][title]", this.form_about_vi.title);
      formData.append("about[0][description]", this.form_about_vi.description);
      formData.append("about[0][status]", this.form_about_vi.status);
      formData.append("about[0][lang_code]", "vi");
      if (this.form_about_vi.avatar instanceof File) {
        formData.append("about[0][avatar]", this.form_about_vi.avatar);
      }

      // Thêm dữ liệu tiếng Anh
      formData.append("about[1][title]", this.form_about_en.title);
      formData.append("about[1][description]", this.form_about_en.description);
      formData.append("about[1][status]", this.form_about_en.status);
      formData.append("about[1][lang_code]", "en");
      if (this.form_about_en.avatar instanceof File) {
        formData.append("about[1][avatar]", this.form_about_en.avatar);
      }
      try {
        const response = api.post("about", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.about.push(response.data);
        this.closeAboutModal();
        fetchAbout();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Thêm thông tin thành công",
        };
      } catch (e) {
        console.log("Error add infomation: ", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi thêm thông tin. Vui lòng thử lại",
        };
      }
    },
    async actionUpdateAbout(about_id) {
      const formData = new FormData();
      formData.append("about[0][id]", this.form_about_vi.id);
      formData.append("about[0][title]", this.form_about_vi.title);
      formData.append("about[0][description]", this.form_about_vi.description);
      formData.append("about[0][status]", this.form_about_vi.status);
      formData.append("about[0][lang_code]", "vi");
      if (this.form_about_vi.avatar instanceof File) {
        formData.append("about[0][avatar]", this.form_about_vi.avatar);
      }

      formData.append("about[1][id]", this.form_about_en.id);
      formData.append("about[1][title]", this.form_about_en.title);
      formData.append("about[1][description]", this.form_about_en.description);
      formData.append("about[1][status]", this.form_about_en.status);
      formData.append("about[1][lang_code]", "en");
      if (this.form_about_en.avatar instanceof File) {
        formData.append("about[1][avatar]", this.form_about_en.avatar);
      }

      try {
        const response = await api.post(
          `about/${about_id}?_method=PUT`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const index = this.about.findIndex((a) => a.id === response.data.id);
        if (index !== -1) {
          this.about.splice(index, 1, response.data);
        }
        this.closeAboutModal();
        fetchAbout();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Cập nhật thông tin thành công.",
        };
      } catch (e) {
        console.log("Error update infomation: ", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi cập nhật thông tin. Vui lòng thử lại",
        };
      }
    },
    async deleteAbout(about_id) {
      try {
        await api.delete(`about/${about_id}`);
        this.about = this.about.filter(
          (a) => a.id !== about_id
        );
        await fetchAbout();
        this.alert = {
          show: true,
          type: "alert-success",
          message: "Thông tin đã được xóa thành công!",
        };
      } catch (e) {
        console.error("Error deleting service:", e);
        this.alert = {
          show: true,
          type: "alert-error",
          message: "Lỗi khi xóa thông tin. Vui lòng thử lại.",
        };
      }
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.user = null;
      this.$router.push("/login");
    },

    formatDate(date) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(date).toLocaleDateString("vi-VN", options);
    },
    getTotalViews() {
      return this.projects.reduce((total, project) => total + project.views, 0);
    },
    openSidebar() {
      this.sidebarOpen = true;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
    selectTab(tab) {
      this.activeTab = tab;
      if (this.isMobile) this.closeSidebar();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form_category_vi.image = file;
        this.form_category_vi.en = file;
      }
    },
    handleIconUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form_services_vi.icon = file;
      }
    },
    handleFileAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form_about_vi.avatar = file;
        this.form_about_en.avatar = file;
      }
    },
    getPreviewImage(file) {
      if (typeof file === "string") {
        return file;
      }
      return URL.createObjectURL(file);
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/style_admin.css";
/* Sidebar base */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: #222;
  color: #fff;
  z-index: 1001;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

/* Sidebar animation for mobile */
.sidebar.mobile {
  transform: translateX(-100%);
}
.sidebar.mobile.open {
  transform: translateX(0);
}

/* Overlay for mobile */
.sidebar-overlay {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

/* Hamburger button */
.hamburger {
  display: none;
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    width: 220px;
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .hamburger {
    display: inline-block !important;
    width: 10%;
  }
  .main-content {
    margin-left: 0 !important;
  }
}

/* Desktop: sidebar luôn hiển thị */
@media (min-width: 1025px) {
  .sidebar {
    transform: translateX(0) !important;
  }
  .sidebar-overlay {
    display: none !important;
  }
  .main-content {
    margin-left: 260px;
  }
}

.form-input {
  color: black;
}
.form-textarea {
  color: black;
}
.project-title {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* Số dòng tối đa */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.project-title:hover {
  white-space: normal;
  -webkit-line-clamp: unset;
}
.service-description,
.category-description {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Số dòng tối đa */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.category-description:hover {
  white-space: normal;
  -webkit-line-clamp: unset;
}

.user-dropdown-wrapper {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: #666;
  font-size: 14px;
}

.user-info {
  padding: 8px 12px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  padding: 8px 12px;
  border: 1px solid #ccc;
  white-space: nowrap;
  z-index: 999;
  display: none;
}

.user-dropdown-wrapper:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  color: #333;
  text-decoration: none;
}

.dropdown-menu a:hover {
  text-decoration: none;
  color: #007bff;
}

.tabs {
  display: flex;
  margin-bottom: 10px;
}
.tab {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #f4f4f4;
  cursor: pointer;
}
.tab.active {
  background: #fff;
  border-bottom: none;
  font-weight: bold;
}
</style>
