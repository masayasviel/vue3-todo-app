<script setup lang="ts">
import {ref, reactive, onMounted} from 'vue';
import TaskForm from '@/components/task-form.vue';
import Category from '@/components/category.vue';
import { ITEM_STATE, ItemStateLiteral, TaskInterface } from '@/interfaces/task.interface';
import { getTaskList, createNewTask, updateStatus, deleteTask } from '@/functions';

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
let _currentSelectUuid = '';

/** --- life cycle --- */

onMounted(async () => {
  await _getTaskList();
});

/** --- public method --- */

/** スナックバー表示 */
function showSnackbar(): void {
  snackbar.isShow = true;
}

/** スナックバー非表示 */
function closeSnackbar(): void {
  snackbar.isShow = false;
}

/** タスクの追加 */
async function addNewTask(input: string): Promise<void> {
  await createNewTask(input);
  await _getTaskList();
  snackbar.text = 'タスクを追加しました';
  showSnackbar();
}

/** 空文字でタスクを追加しようとしたとき */
function inputValueEmpty(): void {
  snackbar.text = '空文字だけの追加はできません';
  showSnackbar();
}

/** タスククリックでダイアログを表示 */
function onClickTask(uuid: string, status: ItemStateLiteral): void {
  _currentSelectUuid = uuid;
  stateModel.value = status;
  dialog.isShow = true;
}

/** タスクの進行状態変更 */
async function onClickCategoryChangeButton(): Promise<void> {
  await updateStatus(_currentSelectUuid, stateModel.value);
  await _getTaskList();
  dialog.isShow = false;
  _currentSelectUuid = '';
  snackbar.text = `${stateModel.value}に変更しました`;
  showSnackbar();
}

/** タスク削除 */
async function onClickDeleteTask(): Promise<void> {
  await deleteTask(_currentSelectUuid);
  await _getTaskList();
  dialog.isShow = false;
  _currentSelectUuid = '';
  snackbar.text = `削除しました`;
  showSnackbar();
}

/** --- private method --- */
async function _getTaskList(): Promise<void> {
  const taskList = await getTaskList();
  notStartedYetCategory.value = taskList.notStartedYetCategory;
  wipCategory.value = taskList.wipCategory;
  finishCategory.value = taskList.finishCategory;
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
