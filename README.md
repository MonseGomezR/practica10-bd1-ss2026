# Práctica 10 - Bases de Datos 1

**Nombre: María Monserrat Gómez Rabatú**

**Carné:** 202030849

## Descripción

API REST desarrollada con NestJS y TypeORM utilizando PostgreSQL en Docker. Se trabaja con la base de datos `gimnasio_powerfit`, correspondiente a la Práctica 7.

La aplicación implementa operaciones CRUD, relaciones entre entidades, consultas mediante QueryBuilder y transacciones.

## Tecnologías utilizadas

- Node.js
- NestJS
- TypeScript
- TypeORM
- PostgreSQL 18
- Docker y Docker Compose
- DBeaver

## Requisitos

Tener instalados Node.js, npm y Docker Desktop.

## Instalación y ejecución

### 1. Iniciar PostgreSQL

Desde la carpeta principal del proyecto:

```powershell
docker compose up -d
```

Verificar que el contenedor esté funcionando:

```powershell
docker ps
```

Comprobar la conexión a PostgreSQL:

```powershell
docker exec -it powerfit_postgres pg_isready -U postgres -d gimnasio_powerfit
```

### 2. Configurar la base de datos

Conectarse desde DBeaver utilizando los siguientes parámetros:

- Host: `localhost`
- Puerto: `5433`
- Base de datos: `gimnasio_powerfit`
- Usuario: `postgres`
- Contraseña: la configurada en Docker

Ejecutar el archivo `sql/practica7.sql` para crear las tablas y cargar los registros iniciales.

La base `gimnasio_powerfit` ya se crea mediante Docker Compose, por lo que no debe ejecutarse nuevamente la instrucción `CREATE DATABASE`.

### 3. Instalar dependencias de NestJS

Entrar a la carpeta del backend:

```powershell
cd backend
```

Instalar dependencias:

```powershell
npm install
```

### 4. Ejecutar la API

```powershell
npm run start:dev
```

La API se ejecuta en:

`http://localhost:3049`

El puerto 3049 corresponde a los últimos dos dígitos del carné 202030849.

## Endpoints

| Método | Ruta                                          | Descripción                      |
| ------- | --------------------------------------------- | --------------------------------- |
| GET     | /clientes                                     | Listar clientes                   |
| GET     | /clientes/:id                                 | Consultar cliente                 |
| POST    | /clientes                                     | Registrar cliente                 |
| PATCH   | /clientes/:id                                 | Actualizar cliente                |
| DELETE  | /clientes/:id                                 | Eliminar cliente                  |
| GET     | /clientes/con-membresia                       | Consultar clientes con membresía |
| GET     | /clientes/buscar-por-membresia?nombre=Mensual | Consulta con QueryBuilder         |
| POST    | /clientes/transaccion                         | Ejecutar transacción             |

## Ejemplos de solicitudes

### Registrar cliente

POST `http://localhost:3049/clientes`

```json
{
  "nombre": "Pedro",
  "apellido": "Innombrable",
  "telefono": "55510004",
  "correo": "pedro@gmail.com",
  "id_membresia": 1
}
```

### Consultar clientes por membresía

GET `http://localhost:3049/clientes/buscar-por-membresia?nombre=Mensual`

### Probar transacción correcta

POST `http://localhost:3049/clientes/transaccion`

```json
{
  "id_cliente": 1,
  "id_membresia": 1,
  "nuevo_precio": 210
}
```

### Probar transacción fallida

POST `http://localhost:3049/clientes/transaccion`

```json
{
  "id_cliente": 1,
  "id_membresia": 1,
  "nuevo_precio": -100
}
```

La transacción fallida requiere que la tabla `membresia` tenga activa la restricción `CHECK (precio > 0)`.

Si se produce un error durante la segunda operación, se ejecuta `ROLLBACK` y se revierten ambos cambios.

## Verificación de restricciones

Para consultar las restricciones CHECK de la tabla `membresia`:

```sql
SELECT
    conname AS restriccion,
    pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid = 'public.membresia'::regclass
  AND contype = 'c';
```

## Comandos adicionales

Detener la aplicación NestJS:

`Ctrl + C`

Detener los contenedores:

```powershell
docker compose down
```

Iniciar nuevamente PostgreSQL:

```powershell
docker compose up -d
```

Ver los registros de PostgreSQL:

```powershell
docker logs powerfit_postgres
```

Verificar el estado de los contenedores:

```powershell
docker ps
```
