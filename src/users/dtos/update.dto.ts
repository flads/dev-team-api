import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the User',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1',
    description: 'The id of the User level',
    required: true,
  })
  @IsNotEmpty()
  level_id: number;

  @ApiProperty({
    example: 'male/female',
    description: 'The gender of the User',
    required: false,
  })
  @IsOptional()
  gender?: string;

  @ApiProperty({
    example: '10/07/2000',
    description: 'The birthdate of the User',
    required: false,
  })
  @IsOptional()
  birthdate?: string;

  @ApiProperty({
    example: 'Woodwork',
    description: 'The hobby of the User',
    required: false,
  })
  @IsOptional()
  hobby?: string;
}
