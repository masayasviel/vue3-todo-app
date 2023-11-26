<script setup lang="ts">
import { computed } from 'vue';
import { TaskInterface } from '@/interfaces/task.interface';

const props = defineProps<{
  title: string;
  tasks: TaskInterface[]
}>();

const tasks = computed(() => [...props.tasks]);
</script>

<template>
  <v-list>
    <v-list-subheader>{{ props.title }}</v-list-subheader>
    <v-list-item
      v-for="task in tasks"
      :key="task.uuid"
    >
      <v-list-item-title v-text="task.title"></v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped>
</style>
