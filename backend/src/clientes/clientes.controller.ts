import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, } from '@nestjs/common';
import { ClientesService } from './clientes.service.js';
import { Cliente } from '../entidades/cliente.entity.js';

@Controller('clientes')
export class ClientesController {
    constructor(
        private readonly clientesService: ClientesService,
    ) { }

    @Get()
    findAll() {
        return this.clientesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.clientesService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<Cliente>) {
        return this.clientesService.create(data);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: Partial<Cliente>,
    ) {
        return this.clientesService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.clientesService.remove(id);
    }
}