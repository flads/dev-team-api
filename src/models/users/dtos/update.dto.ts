import { IsNotEmpty } from 'class-validator';

export class UpdateDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;
}
