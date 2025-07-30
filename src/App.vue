<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
  <router-view></router-view>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  data() {
    return {
      loading: false,
    };
  },
  created() {
    eventBus.on("show-loading", () => {
      this.loading = true;
    });
    eventBus.off("hide-loading", () => {
      this.loading = false;
    });
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.spinner {
  border: 5px solid #ccc;
  border-top: 5px solid #2196f3;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
