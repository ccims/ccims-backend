import { IsNotEmpty, Matches, IsString } from "class-validator";

/**
 * A component of a multi-component project, such as a microservice.
 */
export class ComponentDto {
    /**
     * The component's name.
     */
    @IsNotEmpty()
    @Matches(/^[a-z]+(-[a-z]+)*$/)
    name: string;

    /**
     * The component's display name.
     */
    @IsNotEmpty()
    @IsString()
    displayName: string;
} 