import { Controller, Get, Body, Post } from '@nestjs/common';
import { Component } from '../domain/component';
import { ComponentDto } from '../dto/component.dto';
import { ComponentService } from '../service/component.service';

@Controller('components')
export class ComponentController {

    constructor(private readonly componentService: ComponentService) {

    }

    @Get()
    async getAll(): Promise<Component[]> {
        return this.componentService.getAll();
    }

    @Post()
    async create(@Body() componentDto: ComponentDto) {
        this.componentService.create(componentDto);
    }
}
