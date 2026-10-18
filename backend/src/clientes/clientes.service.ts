
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Pago } from '../entidades/pago.entity.js';
import { Membresia } from '../entidades/membresia.entity.js';
import { Cliente } from '../entidades/cliente.entity.js';


@Injectable()
export class ClientesService {
    constructor(
        @InjectRepository(Cliente)
        private readonly repo: Repository<Cliente>,
        private readonly dataSource: DataSource,
    ) { }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: number) {
        const cliente = await this.repo.findOneBy({
            id_cliente: id,
        });

        if (!cliente) {
            throw new NotFoundException('No existe el cliente');
        }

        return cliente;
    }

    findAllWithMembresia() {
        return this.repo.find({
            relations: {
                membresia: true,
            },
        });
    }

    findByMembresia(nombre: string) {
        return this.repo
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.membresia', 'm')
            .where('m.nombre = :nombre', { nombre })
            .orderBy('c.apellido', 'ASC')
            .addOrderBy('c.nombre', 'ASC')
            .getMany();
    }

    create(data: Partial<Cliente>) {
        const cliente = this.repo.create(data);
        return this.repo.save(cliente);
    }

    async update(id: number, data: Partial<Cliente>) {
        const cliente = await this.findOne(id);

        Object.assign(cliente, data);

        return this.repo.save(cliente);
    }

    async remove(id: number) {
        const cliente = await this.findOne(id);

        await this.repo.delete(cliente.id_cliente);

        return {
            mensaje: 'Cliente eliminado correctamente',
        };
    }

    async registrarPagoYActualizarMembresia(
        id_cliente: number,
        id_membresia: number,
        nuevo_precio: number,
    ) {
        if (!Number.isFinite(nuevo_precio)) {
            throw new BadRequestException('Precio invalido');
        }

        return this.dataSource.transaction(async (manager) => {
            const cliente = await manager.findOneBy(Cliente, {
                id_cliente,
            });

            if (!cliente) {
                throw new NotFoundException('No existe el cliente');
            }

            const membresia = await manager.findOneBy(Membresia, {
                id_membresia,
            });

            if (!membresia) {
                throw new NotFoundException('No existe la membresia');
            }

            const pago = manager.create(Pago, {
                fecha_pago: new Date().toISOString().slice(0, 10),
                monto: '50.00',
                metodo_pago: 'Efectivo',
                id_cliente,
            });

            await manager.save(Pago, pago);

            await manager.update(
                Membresia,
                { id_membresia },
                { precio: String(nuevo_precio) },
            );

            return {
                mensaje: 'Transaccion completada',
                pago,
                nuevo_precio,
            };
        });
    }

}
