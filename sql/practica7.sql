-- =========================================================
-- PRÁCTICA #7 - GIMNASIO POWERFIT
-- =========================================================

-- Crear base de datos
CREATE DATABASE gimnasio_powerfit;

-- =========================================================
-- TABLAS
-- =========================================================

CREATE TABLE membresia (
    id_membresia SERIAL PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE,
    duracion_meses INTEGER NOT NULL CHECK (duracion_meses > 0),
    precio DECIMAL(8,2) NOT NULL CHECK (precio > 0)
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    correo VARCHAR(100) UNIQUE,
    id_membresia INTEGER NOT NULL,
    CONSTRAINT fk_cliente_membresia
        FOREIGN KEY (id_membresia)
        REFERENCES membresia(id_membresia)
);

CREATE TABLE entrenador (
    id_entrenador SERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    especialidad VARCHAR(60) NOT NULL
);

CREATE TABLE categoria (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(40) NOT NULL UNIQUE
);

CREATE TABLE clase (
    id_clase SERIAL PRIMARY KEY,
    nombre_clase VARCHAR(60) NOT NULL,
    horario TIME NOT NULL,
    cupo INTEGER NOT NULL CHECK (cupo > 0),
    id_entrenador INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,

    CONSTRAINT fk_clase_entrenador
        FOREIGN KEY (id_entrenador)
        REFERENCES entrenador(id_entrenador),

    CONSTRAINT fk_clase_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria(id_categoria)
);

CREATE TABLE inscripcion (
    id_inscripcion SERIAL PRIMARY KEY,
    fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
    id_cliente INTEGER NOT NULL,
    id_clase INTEGER NOT NULL,

    CONSTRAINT fk_inscripcion_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE,

    CONSTRAINT fk_inscripcion_clase
        FOREIGN KEY (id_clase)
        REFERENCES clase(id_clase)
        ON DELETE CASCADE,

    CONSTRAINT uq_cliente_clase
        UNIQUE (id_cliente, id_clase)
);

CREATE TABLE pago (
    id_pago SERIAL PRIMARY KEY,
    fecha_pago DATE NOT NULL,
    monto DECIMAL(8,2) NOT NULL CHECK (monto > 0),
    metodo_pago VARCHAR(20) NOT NULL,
    id_cliente INTEGER NOT NULL,

    CONSTRAINT fk_pago_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE CASCADE
);

-- =========================================================
-- INSERTAR REGISTROS (3 POR TABLA)
-- =========================================================

INSERT INTO membresia (nombre, duracion_meses, precio)
VALUES
('Mensual', 1, 200.00),
('Trimestral', 3, 540.00),
('Anual', 12, 1800.00);

INSERT INTO cliente (nombre, apellido, telefono, correo, id_membresia)
VALUES
('Ana', 'Lopez', '55510001', 'ana@gmail.com', 1),
('Luis', 'Perez', '55510002', 'luis@gmail.com', 2),
('Maria', 'Ramirez', '55510003', 'maria@gmail.com', 3);

INSERT INTO entrenador (nombre, especialidad)
VALUES
('Carlos Gomez', 'Pesas'),
('Andrea Morales', 'Yoga'),
('Jose Diaz', 'Cardio');

INSERT INTO categoria (nombre_categoria)
VALUES
('Pesas'),
('Yoga'),
('Spinning');

INSERT INTO clase (nombre_clase, horario, cupo, id_entrenador, id_categoria)
VALUES
('Yoga Matutino', '07:00', 20, 2, 2),
('Spinning Intensivo', '18:00', 15, 3, 3),
('Entrenamiento Funcional', '17:00', 25, 1, 1);

INSERT INTO inscripcion (id_cliente, id_clase, fecha_inscripcion)
VALUES
(1, 1, '2026-09-01'),
(1, 2, '2026-09-02'),
(2, 2, '2026-09-03'),
(2, 3, '2026-09-04'),
(3, 1, '2026-09-05'),
(3, 3, '2026-09-06');

INSERT INTO pago (fecha_pago, monto, metodo_pago, id_cliente)
VALUES
('2026-09-01', 200.00, 'Efectivo', 1),
('2026-09-02', 540.00, 'Tarjeta', 2),
('2026-09-03', 1800.00, 'Transferencia', 3);

-- =========================================================
-- CREAR GRUPO Y USUARIOS
-- =========================================================

CREATE ROLE grupo_gimnasio NOLOGIN;

CREATE USER administrador WITH PASSWORD 'Admin123';
CREATE USER consulta WITH PASSWORD 'Consulta123';

GRANT grupo_gimnasio TO administrador;
GRANT grupo_gimnasio TO consulta;

-- =========================================================
-- PRIVILEGIOS
-- =========================================================

GRANT CONNECT ON DATABASE gimnasio_powerfit TO administrador;
GRANT USAGE ON SCHEMA public TO administrador;
GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO administrador;

GRANT CONNECT ON DATABASE gimnasio_powerfit TO consulta;
GRANT USAGE ON SCHEMA public TO consulta;
GRANT SELECT
ON ALL TABLES IN SCHEMA public
TO consulta;

-- =========================================================
-- VERIFICACIÓN
-- =========================================================

SELECT * FROM membresia;
SELECT * FROM cliente;
SELECT * FROM entrenador;
SELECT * FROM categoria;
SELECT * FROM clase;
SELECT * FROM inscripcion;
SELECT * FROM pago;

-- Verificar usuarios creados
SELECT * FROM pg_shadow;