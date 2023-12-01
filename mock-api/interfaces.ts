const ITEM_STATE = ['未着手', '進行', '完了'] as const;
export type ItemStateLiteral = typeof ITEM_STATE[number];

export interface Tasks {
  title: string;
  status: ItemStateLiteral;
}

export interface TaskListResponse {
  title: string;
  uuid: string;
  status: ItemStateLiteral;
}
