<script setup lang="ts">
import { computed, ref } from 'vue';

const taskInput = ref('');
const rules = {
  maxlength: (value: string) => value.length < 30 || 'cannot input string length over 30',
}
const emit = defineEmits<{
  (e: 'addTask', taskInput: string): void;
  (e: 'inputValueEmpty'): void;
}>();
const buttonDisabled = computed(() => taskInput.value.length > 30);

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
      :rules="[rules.maxlength]"
      label="タスク"
      type="input"
      variant="underlined"
    ></v-text-field>

    <v-btn @click="addNewTask" :disabled="buttonDisabled" prepend-icon="mdi-plus">
      追加
    </v-btn>
  </div>
</template>

<style scoped>
.form-width {
  width: 34%;
}
</style>
