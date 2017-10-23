export interface Practice {
  $key: string;
  courseId: string;
  name: string;
  description: string;
  startOn: Date;
  endOn: Date;
  status: number; // (0: 草案, 1: 公開, 2: 封存)
  createOn: Date;
  createBy: string;
  lastUpdateOn: Date;
  lastUpdateBy: string;
}
