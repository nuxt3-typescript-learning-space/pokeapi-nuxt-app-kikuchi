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
      <button class="modal-close" @click="close" />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  border-radius: 5px;
  position: relative;
  width: 500px;
  height: 600px;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transform: rotate(45deg);
  border: 1px solid #000;
  border-radius: 50%;
  transition: transform 0.2s ease-out;

  &::before,
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    content: '';
    display: block;
    width: 30px;
    height: 1px;
    background: #000;
  }

  &::after {
    transform: translate(-50%, -50%) rotate(90deg);
  }

  &:hover {
    transform: rotate(45deg) scale(1.1);
  }
}
</style>
