<script setup lang="ts">
// src/client/components/snackbar-item.vue
import { ref, onMounted, onUnmounted } from "vue";
import type { Snackbar } from "../composables/alerts";

const props = defineProps<{
  snackbar: Snackbar;
}>();

const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const paused = ref(false);

const startTimer = () => {
  if (props.snackbar.autoCloseInterval > 0 && !paused.value) {
    timer.value = setTimeout(() => {
      props.snackbar.close("interval");
    }, props.snackbar.autoCloseInterval);
  }
};

const pauseTimer = () => {
  paused.value = true;
  if (timer.value) {
    clearTimeout(timer.value);
  }
};

const resumeTimer = () => {
  paused.value = false;
  startTimer();
};

const handleButtonClick = (buttonKey: string, buttonConfig: any) => {
  if (buttonConfig.closes) {
    props.snackbar.close(buttonKey);
  } else {
    props.snackbar._onClick(buttonKey);
  }
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
});
</script>

<template>
  <div
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
    class="w-full max-w-lg mt-4 bg-slate-800 text-slate-200 rounded-lg shadow-2xl shadow-black/50 pointer-events-auto ring-1 ring-black/5 flex items-center p-4"
  >
    <div v-if="snackbar.icon" class="flex-shrink-0 mr-3">
      <component :is="snackbar.icon" class="h-6 w-6" />
    </div>
    <div class="flex-grow text-sm font-medium">
      {{ snackbar.message }}
    </div>
    <div class="flex-shrink-0 ml-4 flex items-center gap-2">
      <button
        v-for="(button, key) in snackbar.buttons"
        :key="key"
        @click="handleButtonClick(String(key), button)"
        :class="[
          'px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200',
          button.additionalClasses || 'bg-slate-700 hover:bg-slate-600',
        ]"
      >
        {{ button.text }}
      </button>
    </div>
  </div>
</template>
