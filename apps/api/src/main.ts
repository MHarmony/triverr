import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as session from 'express-session';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('main');
  const port = configService.get<number>('PORT');
  const prismaService = app.get(PrismaService);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('triverr API')
    .setDescription('triverr API Documentation')
    .setVersion('1.0')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDoc, {
    customSiteTitle: 'triverr - API Documentation',
    swaggerOptions: {
      deepLinking: true,
      filter: true,
      operationSorter: 'alpha',
      tagsSorter: 'alpha'
    }
  });

  await prismaService.enableShutdownHooks(app);

  app.disable('x-powered-by');
  app.enableCors({
    origin: ['development', 'test'].includes(configService.get<string>('NODE_ENV'))
      ? '*'
      : 'https://triverr.mharmony.io'
  });
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  });

  app.use(compression());
  app.use(cookieParser(configService.get<string>('COOKIE_SECRET'), {}));
  app.use(helmet());
  app.use(
    session({
      cookie: {
        secure: true,
        httpOnly: true,
        domain: ['development', 'test'].includes(configService.get<string>('NODE_ENV'))
          ? 'localhost'
          : 'triverr.mharmony.io'
      },
      name: configService.get<string>('SESSION_NAME'),
      secret: configService.get<string>('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(csurf());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  );

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
