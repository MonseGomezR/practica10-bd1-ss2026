import * as typeorm from 'typeorm';
import { Cliente } from './cliente.entity.js';

@typeorm.Entity('pago')
export class Pago {
    @typeorm.PrimaryGeneratedColumn()
    id_pago: number;

    @typeorm.Column({ type: 'date' })
    fecha_pago: string;

    @typeorm.Column({ type: 'decimal', precision: 8, scale: 2 })
    monto: string;

    @typeorm.Column({ type: 'varchar', length: 20 })
    metodo_pago: string;

    @typeorm.Column({ type: 'integer' })
    id_cliente: number;

    @typeorm.ManyToOne(() => Cliente, cliente => cliente.pagos, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    @typeorm.JoinColumn({ name: 'id_cliente' })
    cliente: typeorm.Relation<Cliente>;
}