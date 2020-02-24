import { IsNotEmpty, MinLength, IsAlphanumeric } from 'class-validator';

export class LoginCredentialDto {

    @IsNotEmpty()
    @IsAlphanumeric()
    username: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;

}