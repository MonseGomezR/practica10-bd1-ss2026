# Ejercicio 10 - Comparación de SQL

**Carné:** 202030849
**Base de datos:** `gimnasio_powerfit`
**Tecnologías:** NestJS, TypeORM y PostgreSQL 18
**Puerto API:** 3049

**Importante:** La columna «SQL registrado por TypeORM» debe completarse copiando los comandos reales de la consola de NestJS, con `logging: true`. No se dispone de esos logs en este documento. El SQL manual mostrado a continuación es equivalente en intención a los métodos implementados; TypeORM puede usar alias, columnas explícitas, parámetros y consultas adicionales.

## 1. Consulta con `relations`

**Endpoint:** `GET http://localhost:3049/clientes/con-membresia`

**Código TypeORM:**

```typescript
return this.repo.find({
  relations: { membresia: true },
});
```

| SQL manual equivalente                                                                             | SQL registrado por TypeORM                                        |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `SELECT c.*, m.* FROM cliente AS c LEFT JOIN membresia AS m ON m.id_membresia = c.id_membresia;` | **Pegar aquí el SQL real del log correspondiente al GET.** |

**Comparación:** La consulta obtiene los datos del cliente y su membresía. El SQL manual usa `LEFT JOIN` para conservar la semántica habitual de carga de relaciones mediante `find` (la estrategia de carga configurada puede cambiar el SQL exacto). Se debe verificar el JOIN y las columnas en el log.

## 2. Consulta con `QueryBuilder`

**Endpoint:** `GET http://localhost:3049/clientes/buscar-por-membresia?nombre=Mensual`

**Código TypeORM:**

```typescript
return this.repo
  .createQueryBuilder('c')
  .innerJoinAndSelect('c.membresia', 'm')
  .where('m.nombre = :nombre', { nombre })
  .orderBy('c.apellido', 'ASC')
  .addOrderBy('c.nombre', 'ASC')
  .getMany();
```

| SQL manual equivalente                                                                                                                                               | SQL registrado por TypeORM                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `SELECT c.*, m.* FROM cliente AS c INNER JOIN membresia AS m ON m.id_membresia = c.id_membresia WHERE m.nombre = 'Mensual' ORDER BY c.apellido ASC, c.nombre ASC;` | **Pegar aquí el SQL real del log y sus parámetros (`PARAMETERS`, si aparecen).** |

**Comparación:** Ambos deben realizar un `INNER JOIN`, filtrar por el nombre de la membresía y ordenar por apellido y nombre. En TypeORM, el valor `Mensual` se envía como parámetro enlazado (`$1` en PostgreSQL), en lugar de concatenarse en la consulta.

## 3. Transacción correcta: COMMIT

**Endpoint:** `POST http://localhost:3049/clientes/transaccion`

**JSON de prueba:**

```json
{
  "id_cliente": 1,
  "id_membresia": 1,
  "nuevo_precio": 210
}
```

**SQL manual equivalente (secuencia lógica):**

```sql
BEGIN;

INSERT INTO pago (fecha_pago, monto, metodo_pago, id_cliente)
VALUES (CURRENT_DATE, 50.00, 'Efectivo', 1);

UPDATE membresia
SET precio = 210
WHERE id_membresia = 1;

COMMIT;
```

**SQL registrado por TypeORM:**

```text
PEGAR AQUÍ EL LOG REAL DE LA PRUEBA CORRECTA.
Debe mostrar START TRANSACTION, INSERT, UPDATE y COMMIT.
Pueden aparecer SELECT de verificación y consultas adicionales.
```

**Comparación:** Al completarse ambas operaciones, el pago queda registrado y el precio se actualiza. La transacción se confirma con `COMMIT`.

## 4. Transacción fallida: ROLLBACK

**Endpoint:** `POST http://localhost:3049/clientes/transaccion`

**JSON de prueba:**

```json
{
  "id_cliente": 1,
  "id_membresia": 1,
  "nuevo_precio": -100
}
```

**Condición previa:** La base de datos debe tener activa y validada la restricción `CHECK (precio > 0)` sobre `membresia.precio`, y los registros deben cumplirla. Si se empleó otro CHECK en la Práctica #9, se debe adaptar esta prueba al CHECK realmente utilizado.

**SQL manual equivalente (secuencia lógica):**

```sql
BEGIN;

INSERT INTO pago (fecha_pago, monto, metodo_pago, id_cliente)
VALUES (CURRENT_DATE, 50.00, 'Efectivo', 1);

UPDATE membresia
SET precio = -100
WHERE id_membresia = 1;

-- El CHECK rechaza el UPDATE; se revierte toda la transacción.
ROLLBACK;
```

**SQL registrado por TypeORM:**

```text
PEGAR AQUÍ EL LOG REAL DE LA PRUEBA FALLIDA.
Debe mostrar START TRANSACTION, INSERT, el UPDATE fallido y ROLLBACK.
Pegar también el mensaje de violación del CHECK si aparece.
```

**Comparación:** PostgreSQL rechaza el segundo cambio. Por tratarse de una transacción, el INSERT anterior también se revierte; no se guarda un pago nuevo.

## 5. Consultas de verificación en PostgreSQL

Ejecutar en DBeaver antes y después de la prueba fallida:

```sql
SELECT id_pago, fecha_pago, monto, metodo_pago, id_cliente
FROM pago
WHERE id_cliente = 1
ORDER BY id_pago DESC;

SELECT id_membresia, nombre, precio
FROM membresia
WHERE id_membresia = 1;
```

Para verificar el CHECK:

```sql
SELECT conname AS restriccion,
       pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid = 'public.membresia'::regclass
  AND contype = 'c';
```

**Evidencia a registrar:** Anotar la cantidad o IDs de pagos antes y después de la prueba fallida y el precio de la membresía. El estado debe permanecer igual después del `ROLLBACK`.
