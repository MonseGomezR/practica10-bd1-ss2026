import * as typeorm from 'typeorm';
import { Membresia } from './membresia.entity.js';
import { Pago } from './pago.entity.js';

@typeorm.Entity('cliente')
export class Cliente {
    @typeorm.PrimaryGeneratedColumn()
    id_cliente: number;

    @typeorm.Column({ type: 'varchar', length: 50 })
    nombre: string;

    @typeorm.Column({ type: 'varchar', length: 50 })
    apellido: string;

    @typeorm.Column({ type: 'varchar', length: 15, nullable: true })
    telefono: string | null;

    @typeorm.Column({ type: 'varchar', length: 100, unique: true, nullable: true })
    correo: string | null;

    @typeorm.Column({ type: 'integer' })
    id_membresia: number;

    @typeorm.ManyToOne(() => Membresia, membresia => membresia.clientes, {
        nullable: false,
    })
    @typeorm.JoinColumn({ name: 'id_membresia' })
    membresia: typeorm.Relation<Membresia>;

    @typeorm.OneToMany(() => Pago, pago => pago.cliente)
    pagos: typeorm.Relation<Pago[]>;
}