import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id:number

  @Column({type:"varchar",length:255,unique:true,nullable:false})
  email:string

  @Column({type:"bigint",unique:true,nullable:false})
  mobile:number

  @Column({type:"varchar",length:255,nullable:false})
  name:string

  @Column({type:"text",default:""})
  avatarUri:string

  @Column({type:"varchar",length:255,nullable:false,default:"cn"})
  zone:string

  @Column({type:"varchar",length:255,nullable:false})
  password:string

  @Column({type:"varchar",length:255,nullable:false})
  salt:string

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
}
