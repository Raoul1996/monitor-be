import { IsNotEmpty, IsNumberString } from 'class-validator';

export class ServoDto {
  x: number;
  y: number;
  target: number;
}

export class SetTurnStepDto {
  step: number
  target: number
}

export class CreateServoDto {
  @IsNotEmpty()
  name:string
  @IsNumberString()
  type:number
  description:string;
  isPublic:boolean
  createTime?:number
  isLocked?:boolean
  isDel?:boolean
}
export class UpdateServoDto extends CreateServoDto{}
