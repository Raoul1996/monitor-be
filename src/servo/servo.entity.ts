import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ServoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 ,unique:true})
  name: string;

  @Column({type:"text"})
  description:string

  @Column('int')
  type: number;

  @Column('int')
  ownerId: number;

  @Column({default:0,type:"tinyint",enum:[1,0]})
  isDel: number;
  @Column({default:0,type:"tinyint",enum:[1,0]})
  isLocked: number;
  @Column({default:1,type:"tinyint",enum:[1,0]})
  isPublic: number;

  @Column('bigint')
  createTime: number;

}
