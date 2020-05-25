import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{});
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages:process.env.NODE_ENV === 'prod',
    transform:true
  }))
  app.useStaticAssets(join(__dirname,"..",'public'))
  app.setBaseViewsDir(join(__dirname,"..",'views'))
  app.setViewEngine('hbs')
  await app.listen(3000);

}
bootstrap();
