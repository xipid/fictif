<template>
  <div 
    class="fictif-snack-choose" 
    tabindex="0" 
    ref="containerRef"
    @keydown.stop="onKeyDown"
  >
    <div v-if="options.description" class="fictif-snack-choose__desc">
      {{ options.description }}
    </div>

    <div v-if="options.textbox" class="fictif-snack-choose__input-wrapper">
      <input 
        ref="inputRef"
        type="text" 
        v-model="inputValue" 
        class="fictif-snack-choose__input"
        :placeholder="typeof options.textbox === 'string' ? options.textbox : ''"
      />
    </div>

    <div v-if="options.actions && options.actions.length > 0" class="fictif-snack-choose__actions">
      <button
        v-for="(action, index) in options.actions"
        :key="action.id"
        :class="['fictif-snack-choose__btn', { 'fictif-snack-choose__btn--active': activeIndex === index }]"
        @click="selectAction(action.id)"
      >
        {{ action.content }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import type { SnackChooseOptions } from '../composables/snack';

const props = defineProps<{
  options: SnackChooseOptions;
}>();

const emit = defineEmits<{
  (e: 'result', result: string | null): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const inputValue = ref('');
const activeIndex = ref(0); // 0 could be textbox if present, or first action

const isTextboxActive = computed(() => props.options.textbox && activeIndex.value === 0);

onMounted(() => {
  if (props.options.actions && props.options.actions.length > 0) {
    // If there's a textbox, it's index 0. Actions start at index 1 if textbox exists.
    // Wait, let's keep it simple.
  }
  
  setTimeout(() => {
    containerRef.value?.focus();
    if (props.options.textbox) {
      activeIndex.value = 0;
      inputRef.value?.focus();
    }
  }, 50);
});

function onKeyDown(e: KeyboardEvent) {
  e.stopPropagation();

  const numActions = props.options.actions?.length || 0;
  const hasTextbox = !!props.options.textbox;
  const totalItems = (hasTextbox ? 1 : 0) + numActions;

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeIndex.value = (activeIndex.value - 1 + totalItems) % totalItems;
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeIndex.value = (activeIndex.value + 1) % totalItems;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    if (!(hasTextbox && activeIndex.value === 0)) {
      e.preventDefault();
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (hasTextbox && activeIndex.value === 0) {
      emit('result', inputValue.value);
    } else {
      const actionIdx = hasTextbox ? activeIndex.value - 1 : activeIndex.value;
      if (props.options.actions && props.options.actions[actionIdx]) {
        emit('result', props.options.actions[actionIdx].id);
      } else if (hasTextbox && !props.options.actions?.length) {
        emit('result', inputValue.value);
      }
    }
  } else if (e.key === 'Escape') {
    if (props.options.default !== false) {
      emit('result', typeof props.options.default === 'string' ? props.options.default : null);
    }
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    if (hasTextbox && activeIndex.value !== 0) {
      activeIndex.value = 0;
      inputRef.value?.focus();
    }
  }
}

function selectAction(id: string) {
  emit('result', id);
}

watch(activeIndex, (val: number) => {
  if (val === 0 && props.options.textbox) {
    inputRef.value?.focus();
  } else {
    inputRef.value?.blur();
    containerRef.value?.focus();
  }
});
</script>

<style scoped>
.fictif-snack-choose {
  background: rgba(7, 7, 15, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 250px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  outline: none;
  color: #e2e8f0;
}

.fictif-snack-choose__desc {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

.fictif-snack-choose__input {
  width: 100%;
  background: rgba(18, 18, 42, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.fictif-snack-choose__input:focus {
  border-color: rgba(139, 92, 246, 0.8);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.fictif-snack-choose__actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.fictif-snack-choose__btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 6px 16px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.fictif-snack-choose__btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fictif-snack-choose__btn--active {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.5);
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}
</style>
