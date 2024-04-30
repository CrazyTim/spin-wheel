<script setup>
  import SpinWheel from './components/SpinWheel.vue';
  import { ref } from 'vue'

  const DEFAULT_NUM_ITEMS = 3;

  const count = ref(DEFAULT_NUM_ITEMS);
</script>

<template>
  <button @click="count++">Items: {{ count }}</button>
  <SpinWheel :num-items="count"></SpinWheel>
</template>

<style scoped>
</style>