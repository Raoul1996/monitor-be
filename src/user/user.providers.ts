import { Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { UserEntity } from './user.entity';

export const userProviders:Provider[] = [
  {
    provide:"USER_REPOSITORY",
    useFactory:(connection:Connection)=>connection.getRepository(UserEntity),
    inject:['DATABASE_CONNECTION']
  }
]
