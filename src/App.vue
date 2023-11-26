<script setup lang="ts">
import { ref, reactive } from 'vue';
import TaskForm from '@/components/task-form.vue';
import Category from '@/components/category.vue';
import { ITEM_STATE, ItemStateLiteral, TaskInterface } from '@/interfaces/task.interface';

/** --- 管理 --- */

/** スナックバー管理 */
const snackbar = reactive({
  isShow: false,
  text: '',
  timeout: 1000,
});
/** ダイアログ管理 */
const dialog = reactive({
  isShow: false,
});

/** --- public reactive var --- */

/** 状態選択モデル */
const stateModel = ref<ItemStateLiteral>('未着手');
/** 未着手タスク */
const notStartedYetCategory = ref<TaskInterface[]>([]);
/** 進行中タスク */
const wipCategory = ref<TaskInterface[]>([]);
/** 完了タスク */
const finishCategory = ref<TaskInterface[]>([]);

/** --- private var  --- */

/**
 * 現在選択されているUUID
 * @private
 */
let _currentUuid = '';
/**
 * UUIDとタスクの対応付け
 * @private
 */
const _currentStatus = new Map<string, TaskInterface>();

/** --- public method --- */

/** スナックバー表示 */
function showSnackbar() {
  snackbar.isShow = true;
}

/** スナックバー非表示 */
function closeSnackbar() {
  snackbar.isShow = false;
}

/** タスクの追加 */
function addNewTask(input: string): void {
  const uuid = window.crypto.randomUUID();
  const newTask: TaskInterface = {
    title: input,
    uuid,
    status: '未着手',
  };
  notStartedYetCategory.value.push(newTask);
  _currentStatus.set(uuid, newTask);
}

/** 空文字でタスクを追加しようとしたとき */
function inputValueEmpty() {
  snackbar.text = '空文字だけの追加はできません';
  showSnackbar();
}

/** タスククリックでダイアログを表示 */
function onClickTask(uuid: string) {
  _currentUuid = uuid;
  stateModel.value = _currentStatus.get(uuid)!.status;
  dialog.isShow = true;
}

/** タスクの進行状態変更 */
function onClickCategoryChangeButton() {
  const targetTask = _currentStatus.get(_currentUuid)!;
  _deleteTask();
  targetTask.status = stateModel.value;
  switch (stateModel.value) {
    case '未着手':
      notStartedYetCategory.value.push(targetTask);
      break;
    case '進行':
      wipCategory.value.push(targetTask);
      break;
    case '完了':
      finishCategory.value.push(targetTask);
      break;
    default:
      break;
  }
  _currentStatus.set(_currentUuid, targetTask);
  dialog.isShow = false;
  _currentUuid = '';
  snackbar.text = `${stateModel.value}に変更しました`;
  showSnackbar();
}

/** タスク削除 */
function onClickDeleteTask() {
  _deleteTask();
  dialog.isShow = false;
  _currentUuid = '';
  snackbar.text = `削除しました`;
  showSnackbar();
}

/** --- private method --- */

/**
 * タスク削除
 * @private
 */
function _deleteTask() {
  switch (_currentStatus.get(_currentUuid)!.status) {
    case '未着手':
      notStartedYetCategory.value = notStartedYetCategory.value.filter((v) => v.uuid !== _currentUuid);
      break;
    case '進行':
      wipCategory.value = wipCategory.value.filter((v) => v.uuid !== _currentUuid);
      break;
    case '完了':
      finishCategory.value = finishCategory.value.filter((v) => v.uuid !== _currentUuid);
      break;
  }
  _currentStatus.delete(_currentUuid);
}
</script>

<template>
  <main>
    <TaskForm @addTask="addNewTask" @inputValueEmpty="inputValueEmpty"></TaskForm>
    <div class="d-flex flex-row justify-space-around categories">
      <Category title="未着手" :tasks="notStartedYetCategory" @onClickTask="onClickTask"></Category>
      <Category title="進行" :tasks="wipCategory" @onClickTask="onClickTask"></Category>
      <Category title="完了" :tasks="finishCategory" @onClickTask="onClickTask"></Category>
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
