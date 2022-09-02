import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true
    }),
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      isGlobal: true,
      validationOptions: {
        abortEarly: true
      },
      validationSchema: Joi.object({
        COOKIE_SECRET: Joi.string().required(),
        HOST: Joi.string().default('https://triverr.mharmony.io'),
        NODE_ENV: Joi.string()
          .valid('development', 'test', 'production')
          .default('development'),
        PORT: Joi.number().default(3333),
        SESSION_NAME: Joi.string().required(),
        SESSION_SECRET: Joi.string().required()
      })
    }),
    PrismaModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    })
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
