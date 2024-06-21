<script setup>
  import SpinWheel from './components/SpinWheel.vue';
  import { ref } from 'vue'

  const DEFAULT_NUM_ITEMS = 3;

  const count = ref(DEFAULT_NUM_ITEMS);
</script>

<template>
  <div class="body-wrapper">
    <div class="gui-wrapper">
      <button @click="count++">Items: {{ count }}</button>
    </div>
    <SpinWheel :num-items="count"></SpinWheel>
  </div>
</template>

<style scoped>
</style>