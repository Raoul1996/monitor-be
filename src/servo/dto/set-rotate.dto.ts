export class SetRotateDto {
  readonly x: number;
  readonly y: number;
  readonly target: number;
}

export class SetTurnStepDto {
  readonly step: number
  readonly target: number
}

export class CreateServoDto {
  readonly type:number
  readonly owner:string
  readonly isPublic:boolean
  readonly createTime?:number
  readonly isLocked?:boolean
  readonly isDel?:boolean
}
export class UpdateServoDto extends CreateServoDto{}
