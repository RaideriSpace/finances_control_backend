import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setDefaultResultOrder } from 'dns';

async function bootstrap() {

  setDefaultResultOrder('ipv4first');

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Finanças API')
    .setDescription('Documentação do controle de finanças pessoal')
    .setVersion('1.0')
    .addTag('transacoes')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
