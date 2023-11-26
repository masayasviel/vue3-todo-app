/** タスクの状態 */
export const ITEM_STATE = ['未着手', '進行', '完了'] as const;
/** タスクの状態リテラル型 */
export type ItemStateLiteral = typeof ITEM_STATE[number];

/** タスク型 */
export interface TaskInterface {
  title: string;
  uuid: string;
  status: ItemStateLiteral;
}
