
-- Proyecto: Tu Vehículo Usado
-- Tabla de compras

USE capasalmacen;

CREATE TABLE IF NOT EXISTS compra (
    id INT(11) NOT NULL AUTO_INCREMENT,
    usuario_id INT(11) NOT NULL,
    vehiculo_id INT(11) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_general_ci;
