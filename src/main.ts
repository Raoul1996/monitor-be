import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
const addRequestId  = require("express-request-id")
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{

  });
  app.use(addRequestId({
    uuidVersion:'v4',
    setHeader:true,
    headerName:"X-Request-Id",
    attributeName:'id'
  }))
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
