import { IsNotEmpty, IsString, Matches } from "class-validator";

export class InterfaceDto {
    /**
     * The interface's name.
     */
    @IsNotEmpty()
    @Matches(/^[a-z]+(-[a-z]+)*$/)
    name: string;

    /**
     * The interface's display name.
     */
    @IsNotEmpty()
    @IsString()
    displayName: string;

    /**
     * The interface's type.
     */
    @IsNotEmpty()
    @IsString()
    type: string;
}