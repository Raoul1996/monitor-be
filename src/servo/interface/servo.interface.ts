export interface Servo {
  name:string;
  type:number;
  description:string;
  ownerId:number;
  createTime:number;
  updateTime:number;
  isLocked?:boolean;
}
