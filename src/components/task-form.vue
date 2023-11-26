<script setup lang="ts">
import { ref } from 'vue';

const taskInput = ref('');
const emit = defineEmits<{
  (e: 'addTask', taskInput: string): void;
  (e: 'inputValueEmpty'): void;
}>();

function addNewTask() {
  const inputValue = taskInput.value;
  if (!inputValue) {
    emit('inputValueEmpty');
    return;
  }
  emit('addTask', inputValue);
  taskInput.value = '';
}
</script>

<template>
  <div class="d-flex align-center ga-4 ma-5 form-width">
    <v-text-field
      v-model.trim="taskInput"
      label="タスク"
      variant="underlined"
    ></v-text-field>

    <v-btn @click="addNewTask" prepend-icon="mdi-plus">
      追加
    </v-btn>
  </div>
</template>

<style scoped>
.form-width {
  width: 34%;
}
</style>
