import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local auth guard class to prevent magic strings in JS code after compiling.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') { }