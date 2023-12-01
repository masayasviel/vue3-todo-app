import {ItemStateLiteral, TaskInterface} from '@/interfaces/task.interface';
import {ENDPOINT} from '@/constants';

interface TaskListResponse {
  notStartedYetCategory: TaskInterface[];
  wipCtegory: TaskInterface[];
  finishCategory: TaskInterface[];
}

export async function getTaskList(): Promise<TaskListResponse> {
  const data = await fetch(ENDPOINT);
  return data.json();
}

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

export async function deleteTask(uuid: string): Promise<void> {
  await fetch(`${ENDPOINT}/${uuid}`, {
    method: 'DELETE',
  });
}
