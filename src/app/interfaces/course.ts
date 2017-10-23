export interface Course {
  $key: string;
  courseNo: string;
  description: string;
  startOn: Date;
  endOn: Date;
  address: string;
  location: Geolocation;
  teacher: Array<{
    userId: string;
    isHost: boolean;
  }>;
  applyLink: string;
  status: number; // (0: 草案, 1: 公開, 2: 封存)
  createOn: Date;
  createBy: string;
  lastUpdateOn: Date;
  lastUpdateBy: string;
}
