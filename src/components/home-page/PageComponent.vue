<template>
  <section id="home" class="hero">
    <div class="floating-element">🎬</div>
    <div class="floating-element">✨</div>
    <div class="floating-element">🎨</div>

    <div class="hero-content">
      <h1 data-lang-key="hero-name">HUY LE</h1>
      <div class="subtitle" v-if="currentSection.title" data-lang-key="hero-subtitle">
        {{ currentSection.title }}
      </div>
      <p class="hero-description" v-if="currentSection.description" data-lang-key="hero-description">
        {{ currentSection.description }}
      </p>
      <div class="cta-buttons">
        <a
          href="#portfolio"
          class="btn btn-primary"
          data-lang-key="cta-portfolio"
          >Xem Portfolio</a
        >
        <a href="#contact" class="btn btn-secondary" data-lang-key="cta-contact"
          >Liên hệ ngay</a
        >
      </div>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title animate-on-scroll" data-lang-key="about-title">
        Giới thiệu về tôi
      </h2>
      <div class="about-content">
        <div class="about-image animate-slide-left">
          <img :src="getImageURL(currentAbout.avatar)" alt="Bùi Lê Minh Huy" />
        </div>
        <div class="about-text animate-slide-right">
          <h3 data-lang-key="about-subtitle">
            {{ currentAbout.title }}
          </h3>
          <p data-lang-key="about-p1">
            {{ currentAbout.description }}
          </p>
          <div class="skills">
            <span class="skill-tag">
              <img
                src="@/assets/image/adobe-premiere-svgrepo-com.svg"
                alt="Premiere Pro"
                class="skill-icon"
              />
            </span>
            <span class="skill-tag">
              <img
                src="@/assets/image/adobe-after-effects-icon.svg"
                alt="After Effects"
                class="skill-icon"
              />
            </span>
            <span class="skill-tag">
              <img
                src="@/assets/image/capcut-icon.svg"
                alt="Capcut PC"
                class="skill-icon"
              />
            </span>
            <span class="skill-tag">
              <img
                src="@/assets/image/icons8-davinci-resolve.svg"
                alt="DaVinci Resolve"
                class="skill-icon"
              />
            </span>
            <span class="skill-tag">
              <img
                src="@/assets/image/adobe-photoshop-icon.svg"
                alt="Photoshop"
                class="skill-icon"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="portfolio" class="portfolio">
    <div class="container">
      <h2
        class="section-title animate-on-scroll"
        data-lang-key="portfolio-title"
      >
        {{ getTranslation("portfolio-title") }}
      </h2>
      <div class="portfolio-grid">
        <div
          v-for="cate in filteredCategories"
          :key="cate.id"
          class="portfolio-item animate-on-scroll"
        >
          <img :src="getImageURL(cate.image)" :alt="cate.name" />

          <div class="portfolio-content">
            <router-link :to="`/videos/${cate.id}`">
              <h4 data-lang-key="portfolio-item1-title">
                {{ cate.name }}
              </h4>
              <p data-lang-key="portfolio-item1-desc">
                {{ cate.description }}
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="services" class="services">
    <div class="container">
      <h2 class="section-title" data-lang-key="services-title">
        Dịch vụ của tôi
      </h2>
      <div class="services-grid">
        <div
          v-for="service in filteredServices"
          :key="service.id"
          class="service-card"
        >
          <div class="service-icon">
            <img
              style="width: 10%"
              :src="getImageURL(service.icon)"
              alt="Service Icon"
            />
          </div>
          <h4 data-lang-key="service1-title">{{ service.title }}</h4>
          <p data-lang-key="service1-desc">
            {{ service.description }}
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title" data-lang-key="contact-title">
        Liên hệ với tôi
      </h2>
      <div class="contact-content">
        <div class="contact-info">
          <h4 data-lang-key="contact-info-title">
            <!-- Thông tin liên hệ -->
            {{ getTranslation("contact-info-title") }}
          </h4>
          <div class="contact-item">
            <i>📧</i>
            <span>buyleminhhuy@gmail.com</span>
          </div>
          <div class="contact-item">
            <i>📍</i>
            <span data-lang-key="contact-location">
              <!-- Đà Nẵng, Việt Nam -->
              {{ getTranslation("contact-location") }}
            </span>
          </div>
          <div class="contact-item">
            <i>⏰</i>
            <span data-lang-key="contact-hours">
              {{ getTranslation("contact-hours") }}
            </span>
          </div>
        </div>
        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name" data-lang-key="form-name">
              {{ getTranslation("form-name") }}
            </label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              :placeholder="getTranslation('form-name-placeholder')"
              required
            />
          </div>
          <div class="form-group">
            <label for="email" data-lang-key="form-email">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              :placeholder="getTranslation('form-email-placeholder')"
              required
            />
          </div>
          <div class="form-group">
            <label for="project" data-lang-key="form-project">
              {{ getTranslation("form-project") }}
            </label>
            <input
              type="text"
              id="project"
              v-model="form.project"
              :placeholder="getTranslation('form-project-placeholder')"
            />
          </div>
          <div class="form-group">
            <label for="message" data-lang-key="form-message">
              {{ getTranslation("form-message") }}
            </label>
            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              :placeholder="getTranslation('form-message-placeholder')"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            data-lang-key="form-submit"
          >
            {{ getTranslation("form-submit") }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { fetchCategories } from "@/service/categoryService";
import { getImageURL } from "@/utils/imageHelper";
import { fetchServices } from "@/service/serviceService";
import { fetchSection } from "@/service/sectionService";
import { translations } from "@/assets/js/translations";
import eventBus from "@/utils/eventBus";
import { fetchAbout } from "@/service/aboutService";

export default {
  data() {
    return {
      currentLanguage: "vi",
      categories: [],
      services: [],
      sections: [],
      about: [],
      form: {
        name: "",
        email: "",
        project: "",
        message: "",
      },
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(
        (cat) => cat.lang_code === this.currentLanguage
      );
    },
    filteredServices() {
      return this.services.filter(
        (ser) => ser.lang_code === this.currentLanguage
      );
    },
    currentSection(){
      return this.sections.find((sec) => sec.lang_code === this.currentLanguage && sec.status === 'active') || {};
    },
    currentAbout(){
      return this.about.find((a) => a.lang_code === this.currentLanguage && a.status === 'active') || {};
    }
  },
  async created() {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    }
    this.about = await fetchAbout();
    this.sections = await fetchSection();
    this.categories = await fetchCategories();
    this.services = await fetchServices();
    
  },
  mounted() {
    eventBus.on("language-changed", this.handleLanguageChange);
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      el.classList.add("animated");
    });
    document.querySelectorAll(".animate-slide-left").forEach((el) => {
      el.classList.add("animated");
    });
    document.querySelectorAll(".animate-slide-right").forEach((el) => {
      el.classList.add("animated");
    });
  },
  beforeUnmount() {
    eventBus.off("language-changed", this.handleLanguageChange);
  },
  methods: {
    getImageURL,
    getTranslation(key) {
      return (
        translations[this.currentLanguage]?.[key] ??
        translations["vi"]?.[key] ??
        key
      );
    },
    handleLanguageChange(newLanguage) {
      this.currentLanguage = newLanguage;
    },
    submitForm() {
      console.log(this.form);
      // Reset form after submission
      this.form.name = "";
      this.form.email = "";
      this.form.project = "";
      this.form.message = "";
    },
  },
};
</script>
<style scoped>
/* Add your styles here, similar to the original CSS */
.skill-icon {
  width: 50px;
  height: 50px;
  vertical-align: middle;
  margin-right: 6px;
}

/* Add to <style scoped> */
.social-icon {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  margin: 0 8px;
  transition: transform 0.2s;
}
.social-icon:hover {
  transform: scale(1.15);
}
.service-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-bottom: 16px;
}
.service-icon img {
  width: 60px;
  height: 60px;
  object-fit: contain; /* Giữ tỉ lệ hình gốc */
  display: block;
}
</style>
