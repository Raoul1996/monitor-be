import { IsMobilePhone, Length } from 'class-validator';

export class LoginParams {
  @IsMobilePhone('zh-CN',{strictMode:false},{message:"only china mobile allowed"})
  mobile:number

  @Length(6,20)
  password:string

}

