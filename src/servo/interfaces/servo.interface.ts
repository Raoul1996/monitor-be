export interface Servo {
  name:string;
  type:number;
  description:string;
  owner:string;
  isPublic:boolean;
  createTime?:number;
  isLocked?:boolean;
  isDel?:boolean;
}
