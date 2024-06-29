<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
});
const emits = defineEmits(['update:show']);

const isVisible = ref(props.show);

const close = () => {
  isVisible.value = false;
  emits('update:show', false);
};

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal;
  },
);
</script>

<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="modal-close" @click="close">×</button>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 5px;
  position: relative;
  width: 400px;
  height: 500px;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
