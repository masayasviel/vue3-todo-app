<script setup lang="ts">
import { ref, reactive } from 'vue';
import TaskForm from '@/components/task-form.vue';
import Category from '@/components/category.vue';
import { ITEM_STATE, ItemStateLiteral, TaskInterface } from '@/interfaces/task.interface';

const snackbar = reactive({
  isShow: false,
  text: '',
  timeout: 2000,
});
const dialog = reactive({
  isShow: false,
});
const stateModel = ref<ItemStateLiteral>('未着手');

let _currentUuid = '';
const _currentStatus = new Map<string, TaskInterface>();

const notStartedYet = ref<TaskInterface[]>([]);
const wip = ref<TaskInterface[]>([]);
const finish = ref<TaskInterface[]>([]);

function showSnackbar() {
  snackbar.isShow = true;
}

function closeSnackbar() {
  snackbar.isShow = false;
}

function addNewTask(input: string): void {
  const uuid = window.crypto.randomUUID();
  const newTask: TaskInterface = {
    title: input,
    uuid,
    status: '未着手',
  };
  notStartedYet.value.push(newTask);
  _currentStatus.set(uuid, newTask);
}

function inputValueEmpty() {
  snackbar.text = '空文字だけの追加はできません';
  showSnackbar();
}

function onClickTask(uuid: string) {
  _currentUuid = uuid;
  stateModel.value = _currentStatus.get(uuid)!.status;
  dialog.isShow = true;
}

function onClickCategoryChangeButton() {
  const targetTask = _currentStatus.get(_currentUuid)!;
  _deleteTask();
  targetTask.status = stateModel.value;
  switch (stateModel.value) {
    case '未着手':
      notStartedYet.value.push(targetTask);
      break;
    case '進行':
      wip.value.push(targetTask);
      break;
    case '完了':
      finish.value.push(targetTask);
      break;
    default:
      break;
  }
  _currentStatus.set(_currentUuid, targetTask);
  dialog.isShow = false;
  _currentUuid = '';
}

function onClickDeleteTask() {
  _deleteTask();
  dialog.isShow = false;
  _currentUuid = '';
}

function _deleteTask() {
  switch (_currentStatus.get(_currentUuid)!.status) {
    case '未着手':
      notStartedYet.value = notStartedYet.value.filter((v) => v.uuid !== _currentUuid);
      break;
    case '進行':
      wip.value = wip.value.filter((v) => v.uuid !== _currentUuid);
      break;
    case '完了':
      finish.value = finish.value.filter((v) => v.uuid !== _currentUuid);
      break;
  }
  _currentStatus.delete(_currentUuid);
}
</script>

<template>
  <main>
    <TaskForm @addTask="addNewTask" @inputValueEmpty="inputValueEmpty"></TaskForm>
    <div class="d-flex flex-row justify-space-around categories">
      <Category title="未着手" :tasks="notStartedYet" @onClickTask="onClickTask"></Category>
      <Category title="進行" :tasks="wip" @onClickTask="onClickTask"></Category>
      <Category title="完了" :tasks="finish" @onClickTask="onClickTask"></Category>
    </div>

    <v-dialog
      v-model="dialog.isShow"
      :persistent="true"
      width="300"
    >
      <v-card>
        <v-card-title>どうする？</v-card-title>
        <v-card-item>
          <v-select
            label="状態"
            v-model="stateModel"
            :items="ITEM_STATE"
          ></v-select>
        </v-card-item>
        <v-card-actions class="d-flex justify-space-around">
          <v-btn @click="dialog.isShow = false">キャンセル</v-btn>
          <v-btn color="primary" @click="onClickCategoryChangeButton">変更</v-btn>
          <v-btn color="error" @click="onClickDeleteTask">削除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
.categories {
  height: 600px;
}
</style>
