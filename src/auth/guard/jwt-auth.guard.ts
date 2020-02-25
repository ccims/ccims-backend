import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Jwt auth guard class to prevent magic strings in JS code after compiling.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
