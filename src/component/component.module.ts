import { Module } from '@nestjs/common';
import { ComponentController } from './controller/component.controller';
import { ComponentService } from './service/component.service';

@Module({
    controllers: [ComponentController],
    providers: [ComponentService]
})
export class ComponentModule { }
