import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './modules/common/filters/http-exception.filter';
import { setDefaultResultOrder } from 'dns';

async function bootstrap() {
  setDefaultResultOrder('ipv4first');

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Antes desta whitelist, `enableCors()` sem opções liberava qualquer origem.
  // O deploy no Render não tem ALLOWED_ORIGINS configurada, então o default
  // precisa incluir o domínio real de produção na Vercel — senão toda chamada
  // feita do navegador (fora do fetch server-side do Next) quebra por CORS.
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? ['http://localhost:3000', 'https://raifinances.vercel.app'];
  app.enableCors({ origin: allowedOrigins });

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
void bootstrap();
