<script setup lang="ts">
import { ref, reactive } from 'vue';
import TaskForm from '@/components/task-form.vue';
import Category from '@/components/category.vue';
import { TaskInterface } from '@/interfaces/task.interface';

const snackbar = reactive({
  isShow: false,
  text: '',
  timeout: 2000,
});

const notStartedYet = ref<TaskInterface[]>([]);

function showSnackbar() {
  snackbar.isShow = true;
}

function closeSnackbar() {
  snackbar.isShow = false;
}

function addNewTask(input: string): void {
  notStartedYet.value.push({
    title: input,
    uuid: window.crypto.randomUUID(),
  });
}

function inputValueEmpty() {
  snackbar.text = '空文字だけの追加はできません';
  showSnackbar()
}
</script>

<template>
  <main>
    <TaskForm @addTask="addNewTask" @inputValueEmpty="inputValueEmpty"></TaskForm>
    <Category title="未着手" :tasks="notStartedYet"></Category>
    <v-snackbar
      v-model="snackbar.isShow"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="closeSnackbar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </main>
</template>

<style scoped>
</style>
