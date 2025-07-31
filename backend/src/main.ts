import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description for language center technical test')
    .setVersion('1.0')
    .addBearerAuth(
      {
        scheme: 'bearer',
        type: 'http',
        bearerFormat: 'JWT',
      },
      'access_token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  await app.listen(3000, () => console.log('Server running at port 3000!'));
}
bootstrap();
