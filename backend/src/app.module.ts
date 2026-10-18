import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Cliente } from './entidades/cliente.entity.js';
import { Membresia } from './entidades/membresia.entity.js';
import { Pago } from './entidades/pago.entity.js';

import { ClientesModule } from './clientes/clientes.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'postgres123',
      database: 'gimnasio_powerfit',
      entities: [Cliente, Membresia, Pago],
      synchronize: true,
      logging: true,
      
    }),
    ClientesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}