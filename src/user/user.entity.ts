import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id:number

  @Column({type:"varchar",length:255,unique:true,nullable:false})
  email:string

  @Column({type:"bigint",unique:true,nullable:true})
  mobile:number

  @Column({type:"varchar",length:255,nullable:false})
  name:string

  @Column({type:"text",default:""})
  avatarUri:string

  @Column({type:"varchar",length:255,nullable:false,default:"cn"})
  zone:string

  @Column({type:"varchar",length:255,nullable:true})
  password:string

  @Column({type:"tinyint",enum:[0,1],default:1})
  gender:number;

  @Column({type:"tinyint",default:0})
  role:number

  @Column({type:"tinyint",default:1})
  status: number

  @Column({type:"tinyint",default:0,enum:[0,1]})
  isSuper:number

  @Column({type:'bigint'})
  createTime: number;

  @Column({type:'bigint'})
  updateTime:number;

  @Column({type:"tinyint",nullable:true})
  provider:number;

  @Column({type:'bigint',nullable:true})
  loginId:number;

}
