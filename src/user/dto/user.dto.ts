import { IsEmail, IsIn, IsLocale, IsMobilePhone, IsNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';


export class CreateUserDto {
  @IsNotEmpty()
  name:string

  @IsMobilePhone('zh-CN',{strictMode:false},{message:"only china mobile allowed"})
  mobile:number

  @Length(6,20)
  password:string

  @IsEmail()
  email?:string

  @IsUrl({protocols:["http","https"]})
  @IsOptional()
  avatarUri?:string

  @IsLocale()
  @IsOptional()
  zone?:string

  @IsIn([0,1])
  @IsOptional()
  gender?:number
}
export class UpdateUserDto{
  @IsNotEmpty()
  name:string

  @IsMobilePhone('zh-CN',{strictMode:false},{message:"only china mobile allowed"})
  mobile:number

  @Length(6,20)
  password:string

  @IsEmail()
  email:string

  @IsUrl({protocols:["http","https"]})
  avatarUri:string

  @IsLocale()
  zone:string

  @IsIn([0,1])
  gender:number
}
