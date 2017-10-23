export interface TaskReport {
  $key: string;
  taskId: string;
  userId: string;
  status: number; // (0: 未完成, 1: 完成)
  createOn: Date;
  createBy: string;
  lastUpdateOn: Date;
  lastUpdateBy: string;
}
