import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDeveloperDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the Developer',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '1',
    description: 'The id of the Developer level',
    required: true,
  })
  @IsNotEmpty()
  level_id: number;

  @ApiProperty({
    example: 'male',
    description: 'The gender of the Developer',
    required: false,
  })
  @IsOptional()
  gender?: string;

  @ApiProperty({
    example: '10/07/2000',
    description: 'The birthdate of the Developer',
    required: false,
  })
  @IsOptional()
  birthdate?: string;

  @ApiProperty({
    example: 'Woodwork',
    description: 'The hobby of the Developer',
    required: false,
  })
  @IsOptional()
  hobby?: string;
}
