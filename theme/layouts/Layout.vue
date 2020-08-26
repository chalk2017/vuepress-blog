<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    this is layout!
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      hideNavbar: false,
      isSidebarOpen: true,
      showSidebar: false,
      themeMode: "light",
    };
  },
  beforeMount() {
    // 引入图标库
  },
  computed: {},
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>
