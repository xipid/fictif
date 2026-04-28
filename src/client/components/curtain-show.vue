<template>
  <div class="curtain-show">
    <!-- Game-ish Icon in center -->
    <div class="curtain-show__center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="160"
        height="160"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
        class="curtain-show__icon"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.75 3.104v1.244c0 .892-.56 1.685-1.393 1.986l-1.92.693a1.5 1.5 0 01-1.986-1.393V4.39c0-.892.56-1.685 1.393-1.986l1.92-.693a1.5 1.5 0 011.986 1.393zM2.25 12c0-4.078 2.5-7.5 6-8.82M21.75 12c0 4.078-2.5 7.5-6 8.82m0-17.64c3.5 1.32 6 4.742 6 8.82m-13.5 8.82c-3.5-1.32-6-4.742-6-8.82"
        />
        <circle cx="12" cy="12" r="3" />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v.008m0 5.984v.008M9 12h.008m5.984 0h.008"
        />
      </svg>
    </div>

    <!-- Bottom Text Container -->
    <div class="curtain-show__bottom">
      <div class="curtain-show__info">
        <h2 class="curtain-show__title">{{ title || 'Did you know?' }}</h2>
        <p v-if="message" class="curtain-show__message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCurtain } from "../composables/curtain";
import { computed } from "vue";

const manager = useCurtain();
const title = computed(() => manager.state.title);
const message = computed(() => manager.state.message);
</script>

<style scoped>
.curtain-show {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  color: white;
  background: #07070f;
}

.curtain-show__center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.curtain-show__icon {
  color: #818cf8; /* simple distinct color, no glow */
}

.curtain-show__bottom {
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.curtain-show__info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* close to each other */
}

.curtain-show__title {
  font-size: 1.5rem;
  font-weight: bold; /* title is bold */
  color: #ffffff;
  margin: 0;
}

.curtain-show__message {
  font-size: 1.125rem;
  font-weight: normal; /* content is not bold */
  color: #94a3b8;
  margin: 0;
}
</style>
