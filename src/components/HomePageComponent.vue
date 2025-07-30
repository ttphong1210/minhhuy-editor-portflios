<template>
  <div>
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "./home-page/AppHeader.vue";
import AppFooter from "./home-page/AppFooter.vue";

export default {
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style scoped>
@import "@/assets/css/style.css";
/* Add your styles here, similar to the original CSS */
</style>
