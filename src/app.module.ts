import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RoomsModule,
  ],
})
export class AppModule {}
