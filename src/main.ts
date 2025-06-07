import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins: string[] = [
    'http://localhost:3000',
    'https://iylmibs.com', // production url
    'https://iylmibs.vercel.app', // staging url
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  if (process.env.NODE_ENV === 'production') {
    allowedOrigins.push('https://iyl-backend.onrender.com');
  }

  const config = new DocumentBuilder()
    .setTitle('IYL BACKEND API')
    .setDescription('API for building IYL BACKEND')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .addBearerAuth()
    .setContact(
      'Ariyibi Joseph Iseoluwa',
      'https://github.com/ise2005best',
      'iseoluwaariyibi@gmail.com',
    )
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
