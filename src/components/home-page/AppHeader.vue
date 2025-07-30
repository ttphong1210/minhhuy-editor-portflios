<template>
  <div class="scroll-indicator">
    <div class="scroll-progress" id="scrollProgress"></div>
  </div>

  <header>
    <nav class="container">
      <div class="logo"><router-link to="/">HUYLE</router-link></div>
      <ul class="nav-links">
        <li><a href="#home" data-lang-key="nav-home">{{ getTranslation('nav-home') }}</a></li>
        <li><a href="#about" data-lang-key="nav-about">{{ getTranslation('nav-about') }}</a></li>
        <li>
          <a href="#portfolio" data-lang-key="nav-portfolio">{{ getTranslation('nav-portfolio') }}</a>
        </li>
        <li><a href="#services" data-lang-key="nav-services">{{ getTranslation('nav-services') }}</a></li>
        <li><a href="#contact" data-lang-key="nav-contact">{{ getTranslation('nav-contact') }}</a></li>
      </ul>
      <div class="language-switcher">
        <select id="languageSelect" v-model="currentLanguage" @change="changeLanguage">
          <option value="vi" selected>Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  </header>
</template>
<script>
import { translations } from "@/assets/js/translations";
import eventBus from "@/utils/eventBus";

export default {
  data() {
    return {
      scrollProgress: 0,
      currentLanguage: "vi",
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    document.documentElement.lang = this.currentLanguage;
    eventBus.emit('language-changed', this.currentLanguage);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  created() {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage) {
      this.currentLanguage = savedLanguage;
    }
  },
  methods: {
    getTranslation(key) {
      return translations[this.currentLanguage][key] || key;
    },

    changeLanguage() {
      document.documentElement.lang = this.currentLanguage;
      localStorage.setItem("selectedLanguage", this.currentLanguage);
      eventBus.emit('language-changed', this.currentLanguage);
      
      document.querySelectorAll("[data-lang-key]").forEach((element) => {
        const key = element.getAttribute("data-lang-key");
        if (translations[this.currentLanguage][key]) {
          element.textContent = translations[this.currentLanguage][key];
        }
      });

      document
        .querySelectorAll("[data-lang-key-placeholder]")
        .forEach((element) => {
          const key = element.getAttribute("data-lang-key-placeholder");
          if (translations[this.currentLanguage][key]) {
            element.placeholder = translations[this.currentLanguage][key];
          }
        });
    },
    handleScroll() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      this.scrollProgress = (scrollTop / scrollHeight) * 100;

      const progressBar = document.getElementById("scrollProgress");
      if (progressBar) {
        progressBar.style.width = `${this.scrollProgress}%`;
      }
    },
  },
};
</script>
<style>
.logo a {
  text-decoration: none;
  color: #ff6b35;
}
</style>
