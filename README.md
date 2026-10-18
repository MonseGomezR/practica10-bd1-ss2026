
# Práctica 10 - Bases de Datos 1

**María Monserrat Gómez Rabatú**

**Carné:** 202030849

## Descripción

API REST desarrollada con NestJS y TypeORM, utilizando PostgreSQL en Docker y la base de datos gimnasio_powerfit de la Práctica 7.

## Tecnologías

- NestJS
- TypeScript
- TypeORM
- PostgreSQL 18
- Docker Compose

## Ejecución

1. Configurar las variables de entorno utilizando los archivos de ejemplo.
2. Iniciar PostgreSQL con `docker compose up -d`.
3. Cargar el script SQL de la Práctica 7 en la base de datos.
4. Entrar a la carpeta `backend`.
5. Instalar dependencias mediante `npm install`.
6. Ejecutar la aplicación mediante `npm run start:dev`.

La API utiliza el puerto 3049.

## Funcionalidades

- CRUD de clientes.
- Relaciones entre clientes, membresías y pagos.
- Consultas con TypeORM.
- Consultas mediante QueryBuilder.
- Transacciones con COMMIT y ROLLBACK.
