import { IsEmail, IsNotEmpty, IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Please provide a name' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsDateString({}, { message: 'Please provide a start date' })
  startDate: string;

  @IsDateString({}, { message: 'Please provide a end date' })
  endDate: string;

  @IsInt()
  @IsPositive({ message: 'Please provide a start date' })
  nights: number;

  @IsPositive({ message: 'Please provide a end date' })
  price: number;

  @IsInt()
  @IsPositive({ message: 'Please provide a valid room ID' })
  roomId: number;
}