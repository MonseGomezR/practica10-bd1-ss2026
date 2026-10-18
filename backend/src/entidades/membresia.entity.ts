import * as typeorm from 'typeorm';
import { Cliente } from './cliente.entity.js';

@typeorm.Entity('membresia')
export class Membresia {
    @typeorm.PrimaryGeneratedColumn()
    id_membresia: number;

    @typeorm.Column({ type: 'varchar', length: 30, unique: true })
    nombre: string;

    @typeorm.Column({ type: 'integer' })
    duracion_meses: number;

    @typeorm.Column({ type: 'decimal', precision: 8, scale: 2 })
    precio: string;

    @typeorm.OneToMany(() => Cliente, cliente => cliente.membresia)
    clientes: typeorm.Relation<Cliente[]>;
}