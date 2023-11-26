<script setup lang="ts">
import { computed } from 'vue';
import { TaskInterface } from '@/interfaces/task.interface';

const props = defineProps<{
  title: string;
  tasks: TaskInterface[]
}>();

const emit = defineEmits<{
  (e: 'onClickTask', uuid: string): void;
}>();

const tasks = computed(() => [...props.tasks]);
</script>

<template>
  <v-card
    class="mx-auto category-box"
  >
    <v-list>
      <v-list-subheader>{{ props.title }}</v-list-subheader>
      <v-list-item
        v-for="task in tasks"
        :key="task.uuid"
        class="task-item"
        @click="emit('onClickTask', task.uuid)"
      >
        <v-list-item-title v-text="task.title"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.category-box {
  width: 25%;
}
.task-item:hover {
  background-color: #eeeeee;
}
</style>
