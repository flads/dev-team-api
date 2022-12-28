import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    example: 'Júnior',
    description: 'The name of the Level',
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
