<script setup lang="ts">
// src/client/components/snackbar-container.vue
import { useAlerts } from "../composables/alerts.js";
import SnackbarItem from "./snackbar-item.vue";

const { snackbars } = useAlerts();
</script>

<template>
  <div
    aria-live="assertive"
    class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 z-[100]"
  >
    <div
      class="w-full flex flex-col-reverse items-center space-y-4 space-y-reverse"
    >
      <TransitionGroup
        tag="div"
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="ease-in duration-200 transition"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        class="w-full max-w-lg flex flex-col items-center"
      >
        <SnackbarItem
          v-for="snackbar in snackbars"
          :key="snackbar.id"
          :snackbar="snackbar"
        />
      </TransitionGroup>
    </div>
  </div>
</template>
