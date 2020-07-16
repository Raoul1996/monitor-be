import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuthEntity {
  @PrimaryGeneratedColumn()
  id:number

  @Column({type:'varchar',length:255, nullable:false})
  code:string

  @Column({type:'bigint',nullable:false})
  user_id:number

  @Column({type:"tinyint",default:0})
  status: number

  @Column({type:'bigint'})
  createTime: number;

  @Column({type:'bigint'})
  updateTime:number;
}
