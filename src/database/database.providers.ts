import { createConnection } from 'typeorm';
import { join } from 'path';
import { Provider } from '@nestjs/common';

export const databaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => await createConnection({
      type: 'sqlite',
      database: join(__dirname, '../../', 'monitor.db'),
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}'
      ],
      key:'side.project.monitor',
      synchronize: true,
      logging:"all",
      logger:"advanced-console",
    }),
  },
];
