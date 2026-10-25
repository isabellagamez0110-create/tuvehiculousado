
-- Proyecto: Tu Vehículo Usado
-- Tabla de vehículos o productos

USE capasalmacen;

CREATE TABLE IF NOT EXISTS producto (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT(11) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'Carro',
    marca VARCHAR(50) NOT NULL DEFAULT '',
    modelo VARCHAR(50) NOT NULL DEFAULT '',
    anio INT(11) NOT NULL DEFAULT 2000,
    descripcion VARCHAR(500) NOT NULL DEFAULT '',
    imagen VARCHAR(500) DEFAULT NULL,
    usuario_id INT(11) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
