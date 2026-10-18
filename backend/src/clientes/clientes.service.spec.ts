import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entidades/cliente.entity.js';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly repo: Repository<Cliente>,
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
}