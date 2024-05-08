import { IsInt, IsString, IsOptional, IsNumber, IsArray, IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { AvailabilityStatus, RoomType  } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsEnum(RoomType)
  roomType: RoomType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumberString()
  @IsNotEmpty()
  pricePerNight: string;

  @IsNumberString()
  capacity: string;

  @IsNumberString()
  roomSize: string;

  @IsEnum(AvailabilityStatus)
  availabilityStatus: AvailabilityStatus;

  // @IsArray()
  // imageUrls: string[];
}

