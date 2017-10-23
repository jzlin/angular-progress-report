export interface Task {
  $key: string;
  practiceId: string;
  description: string;
  order: number;
  status: number; // (0: 草案, 1: 公開, 2: 封存)
  createOn: Date;
  createBy: string;
  lastUpdateOn: Date;
  lastUpdateBy: string;
}
