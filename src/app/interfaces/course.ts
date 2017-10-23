export interface Course {
  id?: string;
  courseNo: string;
  name: string;
  description: string;
  startOn: string;
  endOn: string;
  address: string;
  teacher: Array<{
    userId: string;
    isHost: boolean;
  }>;
  applyLink: string;
  status: number; // (0: 草案, 1: 公開, 2: 封存)
  createBy?: string;
  createOn?: string;
  lastUpdateOn?: string;
}
