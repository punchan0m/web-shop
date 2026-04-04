import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { buildTypeOrmConfig } from './config/typeorm.config';

import { ProductsModule } from './modules/products/products.module';
import { ProductsCategoriesModule } from './modules/products-categories/products-categories.module';
import { ImagesModule } from './modules/images/images.module';
import { ContentModule } from './modules/content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'docker'
          ? '.env.docker'
          : '.env.local',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => buildTypeOrmConfig(configService),
    }),
    ProductsModule,
    ProductsCategoriesModule,
    ImagesModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}