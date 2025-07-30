<template>
  <section class="videos">
    <div class="container">
      <!-- THÔNG BÁO KHI KHÔNG CÓ VIDEO -->
      <div v-if="videos.length === 0" class="no-video-message">
        <p>Chưa có video, hình ảnh nào. Đang được cập nhật.</p>
      </div>

      <div class="video-grid">
        <div
          class="video-item animate-on-scroll"
          v-for="video in videos"
          :key="video.id"
        >
          <iframe
            v-if="video.video_embed_url"
            :src="video.video_embed_url"
            frameborder="0"
            allowfullscreen
            class="video-player"
          ></iframe>
          <a
            v-else
            :href="video.video_url"
            target="_blank"
            class="text-blue-600 underline block mt-2"
          >
            Xem video trực tiếp trên nền tảng
          </a>
          <div class="video-content">
            <h4>{{ video.title }}</h4>
            <p class="video-description">{{ video.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { fetchCategories } from "@/service/categoryService";
import api from "@/utils/axios";
import eventBus from "@/utils/eventBus";

export default {
  data() {
    return {
      videos: [],
      categories: [],
      currentLanguage: "vi",
    };
  },
  created() {
    const savedLang = localStorage.getItem("selectedLanguage");
    if (savedLang) {
      this.currentLanguage = savedLang;
    }
  },
  async mounted() {
    eventBus.on("language-changed", this.handleLanguageChange);
    this.categories = await fetchCategories();
    await this.fetchVideos();
  },
  beforeUnmount() {
    eventBus.off("language-changed", this.handleLanguageChange);
  },
  methods: {
    async fetchVideos() {
      try {
        const cate_id = this.$route.params.id;
        const response = await api.get(`categories/${cate_id}/portfolios`);
        this.videos = (response.data || []).filter(
          (video) => video.lang_code === this.currentLanguage
        );
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    },
    translationCategoriesID(currentID, langCode) {
      const category = this.categories.find(
        (c) => c.id === parseInt(currentID)
      );
      if (!category) {
        return currentID;
      }
      if (category.lang_code === langCode) {
        return currentID;
      }
      if (category.lang_code === "vi" && langCode === "en") {
        const translated = this.categories.find(
          (c) => c.translation_id === category.id && c.lang_code === "en"
        );
        return translated ? translated.id : currentID;
      }

      if (category.lang_code === "en" && langCode === "vi") {
        const viCategory = this.categories.find(
          (c) => c.id === category.translation_id && c.lang_code === "vi"
        );
        return viCategory
          ? viCategory.id
          : category.translation_id || currentID;
      }
      return currentID;
    },
    async handleLanguageChange(newLanguage) {
      this.currentLanguage = newLanguage;
      try {
        const oldID = this.$route.params.id;
        const newID = this.translationCategoriesID(oldID, newLanguage);
        if (newID !== parseInt(oldID)) {
          await this.$router.replace({
            name: "videos-category",
            params: { id: newID },
          });
          await this.fetchVideos();
        } else {
          await this.fetchVideos();
        }
      } catch (error) {
        console.error("Error handling language change:", error);
        await this.fetchVideos();
      }
    },
  },
};
</script>
<style scoped>
.videos {
  padding: 100px 0;
  background: #0f0f23;
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.video-item {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(77, 171, 247, 0.2);
}

.video-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(77, 171, 247, 0.2);
}

.video-player {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.video-content {
  padding: 1.5rem;
}

.video-content h4 {
  color: #ff6b35;
  margin-bottom: 0.5rem;
}

.video-content p {
  color: #cccccc;
  margin-bottom: 1rem;
}

.video-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.video-description {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Số dòng tối đa */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.video-description:hover {
  white-space: normal;
  -webkit-line-clamp: unset;
}

.no-video-message {
  text-align: center;
  padding: 40px 0;
  font-size: 18px;
  color: #888;
}
/* Responsive Tablet ≥768px */
@media (min-width: 768px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .video-player {
    height: 250px;
  }
}

/* Responsive Desktop ≥1024px */
@media (min-width: 1024px) {
  .videos {
    height: 100vh;
  }
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .video-player {
    height: 300px;
  }
}
</style>
