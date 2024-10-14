import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api')

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })

  app.use(morgan('dev'));
  
  app.useGlobalPipes(
    new ValidationPipe({ transformOptions: { enableImplicitConversion: true } })
  )

  const reflector = app.get('Reflector');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const url = configService.get('APP_URL');


  const title: string = configService.get('APP_NAME');

  // if (configService.get('APP_PROD') === 'false') {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(title)
    .setDescription('API Documentation for the application')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  // }

  await app.listen(parseInt(port));
  console.log(`Application is running on: ${url}`);
}
bootstrap();

