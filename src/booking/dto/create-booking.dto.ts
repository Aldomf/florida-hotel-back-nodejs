import { IsEmail, IsNotEmpty, IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @IsPositive()
  nights: number;

  @IsPositive()
  price: number;
}