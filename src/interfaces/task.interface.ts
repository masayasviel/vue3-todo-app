export const ITEM_STATE = ['未着手', '進行', '完了'] as const;
export type ItemStateLiteral = typeof ITEM_STATE[number];

export interface TaskInterface {
  title: string;
  uuid: string;
  status: ItemStateLiteral;
}
