import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe, } from '@nestjs/common';
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

    @Get('view-membresia')
    findAllWithMembresia() {
        return this.clientesService.findAllWithMembresia();
    }


    @Get('find-by-membresia')
    findByMembresia(@Query('nombre') nombre: string) {
        return this.clientesService.findByMembresia(nombre);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.clientesService.findOne(id);
    }


    @Post('transaccion')
    registrarTransaccion(
        @Body() data: {
            id_cliente: number;
            id_membresia: number;
            nuevo_precio: number;
        },
    ) {
        return this.clientesService.registrarPagoYActualizarMembresia(
            data.id_cliente,
            data.id_membresia,
            data.nuevo_precio,
        );
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