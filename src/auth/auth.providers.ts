import { Provider } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AuthEntity } from './auth.entity';

export const authProviders: Provider[] = [{
  provide: 'AUTH_REPOSITORY',
  useFactory: (connection: Connection) => connection.getRepository(AuthEntity),
  inject: ['DATABASE_CONNECTION'],
}]
