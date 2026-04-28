<template>
  <div class="fictif-snack-container" :class="{ 'fictif-snack-container--global': isGlobal }">
    <TransitionGroup name="snack-list" tag="div" class="fictif-snack-container__list">
      <div
        v-for="item in activeItems"
        :key="item.id"
        class="fictif-snack-container__item-wrapper"
      >
        <component
          :is="item.component"
          v-if="item.showing"
          v-bind="item.props"
          @close="item.destroy()"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSnack, globalSnackManager, type SnackManager } from '../composables/snack';

const props = defineProps<{
  manager?: SnackManager;
  global?: boolean;
}>();

const actualManager = computed(() => {
  if (props.manager) return props.manager;
  if (props.global) return globalSnackManager;
  return useSnack();
});

const isGlobal = computed(() => props.global || (!props.manager && props.global !== false));

const activeItems = computed(() => {
  return actualManager.value.items;
});
</script>

<style scoped>
.fictif-snack-container {
  position: relative;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.fictif-snack-container--global {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.fictif-snack-container__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.fictif-snack-container__item-wrapper {
  pointer-events: auto;
}

.snack-list-move,
.snack-list-enter-active,
.snack-list-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.snack-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.snack-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.snack-list-leave-active {
  position: absolute;
}
</style>
