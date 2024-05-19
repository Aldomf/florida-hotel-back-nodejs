import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsArray()
  imageIndicesToDelete?: number[];

  @IsOptional()
  @IsArray()
  imageUrls: string[];
}
