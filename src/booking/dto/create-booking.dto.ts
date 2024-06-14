import { IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

