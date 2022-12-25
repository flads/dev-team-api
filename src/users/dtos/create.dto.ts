import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the User',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'The email of the User',
    required: true,
  })
  @IsNotEmpty()
  email: string;
}
