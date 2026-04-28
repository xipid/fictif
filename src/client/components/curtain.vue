<template>
  <Transition
    name="curtain-fade"
    @after-enter="onCurtainEntered"
    @after-leave="onCurtainExited"
  >
    <div
      v-if="isVisible"
      :class="['fictif-curtain', `fictif-curtain--${mode}`]"
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-live="assertive"
    >
      <!-- Mode: Full -->
      <template v-if="mode === 'full'">
        <div class="curtain__overlay"></div>

        <div class="curtain__content">
          <div class="curtain__custom">
            <component :is="component || CurtainShow" />
          </div>
        </div>
      </template>

      <!-- Mode: Light -->
      <div v-if="mode === 'light'" class="curtain__light-spinner">
        <div class="curtain__spinner"></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, ref, onUnmounted, onMounted, nextTick } from "vue";
import { useCurtain } from "../composables/curtain";
import CurtainShow from "./curtain-show.vue";

const isVisible = ref(false);
const mode = ref("full");
const component = ref(null);

const curtainManager = useCurtain();

let preCurtainRemoved = false;
const removePreCurtain = () => {
  if (preCurtainRemoved) return;
  const preCurtainElements = document.querySelectorAll(".fictif-pre-curtain");
  for (const item of preCurtainElements) {
    item.style.transition = "opacity 0.5s ease";
    item.style.opacity = "0";
    setTimeout(() => item.remove(), 500);
  }
  preCurtainRemoved = true;
};

const onCurtainEntered = () => {
  removePreCurtain();
  curtainManager._signalFadeIn();
};

const onCurtainExited = () => {
  curtainManager._signalFadeOut();
};

const updateStateFromManager = () => {
  const state = curtainManager.state;
  isVisible.value = state.keepers.length > 0;
  mode.value = state.mode;
  component.value = state.component;
};

onMounted(() => {
  updateStateFromManager();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      curtainManager.setCurtainMounted(true);
    });
  });

  watch(() => curtainManager.state.keepers.length, updateStateFromManager);
  watch(() => curtainManager.state.mode, updateStateFromManager);
  watch(() => curtainManager.state.component, updateStateFromManager);

  nextTick(() => {
    if (!isVisible.value) {
      removePreCurtain();
    }
  });
});

onUnmounted(() => {
  curtainManager.setCurtainMounted(false);
  unlockBodyScroll();
});

const lockBodyScroll = () => {
  document.body.style.overflow = "hidden";
};

const unlockBodyScroll = () => {
  setTimeout(() => {
    document.body.style.overflow = "";
  }, 300);
};

watch(isVisible, (isNowVisible) => {
  if (isNowVisible) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
});
</script>

<style scoped>
.fictif-curtain {
  position: fixed;
  inset: 0;
  z-index: 10000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.fictif-curtain--full {
  background: #09090b; /* different static background color */
}

.curtain__overlay {
  position: absolute;
  inset: 0;
}

.curtain__content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.curtain__custom {
  width: 100%;
  height: 100%;
}

/* Mode: Light */
.curtain__light-spinner {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
  padding: 1rem;
  border-radius: 1rem;
}

.curtain__spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #4f46e5;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Transitions */
.curtain-fade-enter-active,
.curtain-fade-leave-active {
  transition: opacity 0.8s ease;
}

.curtain-fade-enter-from,
.curtain-fade-leave-to {
  opacity: 0;
}
</style>
