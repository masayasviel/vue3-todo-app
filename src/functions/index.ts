import {ItemStateLiteral, TaskInterface} from '@/interfaces/task.interface';
import {ENDPOINT} from '@/constants';

/** タスク一覧レスポンス */
interface TaskListResponse {
  notStartedYetCategory: TaskInterface[];
  wipCategory: TaskInterface[];
  finishCategory: TaskInterface[];
}

/** タスク一覧取得 */
export async function getTaskList(): Promise<TaskListResponse> {
  const data = await fetch(ENDPOINT);
  return data.json();
}

/**
 * タスク作成
 * @param title タスクタイトル
 */
export async function createNewTask(title: string): Promise<void> {
  const body = {
    title: title,
    status: '未着手',
  };
  await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

/**
 * タスク状態更新
 * @param uuid タスクUUID
 * @param status タスク新状態
 */
export async function updateStatus(uuid: string, status: ItemStateLiteral): Promise<void> {
  await fetch(`${ENDPOINT}/${uuid}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
    }),
  });
}

/**
 * タスク削除
 * @param uuid タスクUUID
 */
export async function deleteTask(uuid: string): Promise<void> {
  await fetch(`${ENDPOINT}/${uuid}`, {
    method: 'DELETE',
  });
}
