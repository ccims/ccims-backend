import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * JWT passport stategy to validate a given JWT token.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('SECRET'),
        });
    }

    /**
     * Validates a JWT token
     * @param payload the payload of the jwt token.
     * @returns An object containing the user id and username.
     */
    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}