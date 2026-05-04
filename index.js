const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el cuerpo de la petición

// Base de datos simulada en memoria
let vehiculos = [
    { id: 101, marca: "Toyota", modelo: "Corolla", placa: "IBA-4521" },
    { id: 102, marca: "Nissan", modelo: "Sentra", placa: "PCC-1234" }
];

// Generador de IDs simples
let idActual = 103;

let inspecciones = [
    // El 'vehiculoId' es nuestra "llave foránea" que conecta ambas tablas
    { id: 1, vehiculoId: 101, fecha: "2026-05-04", resultado: "Aprobado", observaciones: "Frenos en buen estado" }
];
let idInspeccionActual = 2;

// ==========================================
// ENDPOINTS (CRUD)
// ==========================================

// 1. GET /api/Vehiculos -> Obtener todos los vehículos
app.get('/api/Vehiculos', (req, res) => {
    res.json(vehiculos);
});

// 2. GET /api/Vehiculos/:id -> Obtener un vehículo por ID
app.get('/api/Vehiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const vehiculo = vehiculos.find(v => v.id === id);
    
    if (vehiculo) {
        res.json(vehiculo);
    } else {
        res.status(404).json({ error: "Vehículo no encontrado" });
    }
});

// 3. POST /api/Vehiculos -> Crear un nuevo vehículo
app.post('/api/Vehiculos', (req, res) => {
    const nuevoVehiculo = {
        id: idActual++,
        marca: req.body.marca,
        modelo: req.body.modelo,
        placa: req.body.placa
    };
    vehiculos.push(nuevoVehiculo);
    res.status(201).json(nuevoVehiculo);
});

// 4. PUT /api/Vehiculos/:id -> Actualizar un vehículo
app.put('/api/Vehiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = vehiculos.findIndex(v => v.id === id);

    if (indice !== -1) {
        // Actualiza el campo si viene en la petición, si no, mantiene el actual
        vehiculos[indice] = {
            id: id,
            marca: req.body.marca || vehiculos[indice].marca,
            modelo: req.body.modelo || vehiculos[indice].modelo,
            placa: req.body.placa || vehiculos[indice].placa
        };
        res.json(vehiculos[indice]);
    } else {
        res.status(404).json({ error: "Vehículo no encontrado para actualizar" });
    }
});

// 5. DELETE /api/Vehiculos/:id -> Eliminar un vehículo
app.delete('/api/Vehiculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const longitudInicial = vehiculos.length;
    
    // Filtramos el arreglo para dejar fuera el vehículo con ese ID
    vehiculos = vehiculos.filter(v => v.id !== id);

    if (vehiculos.length < longitudInicial) {
        res.status(200).send(); // Operación exitosa, no se devuelve contenido
    } else {
        res.status(404).json({ error: "Vehículo no encontrado para eliminar" });
    }
});

// ==========================================
// ENDPOINTS PARA INSPECCIONES
// ==========================================

// GET /api/Inspecciones -> Obtener TODAS las inspecciones de todos los vehículos
app.get('/api/Inspecciones', (req, res) => {
    res.json(inspecciones);
});

// GET /api/Inspecciones/vehiculo/:id -> Obtener las inspecciones de UN vehículo en específico
app.get('/api/Inspecciones/vehiculo/:id', (req, res) => {
    const vehiculoId = parseInt(req.params.id);
    
    // Filtramos para devolver solo las inspecciones que coincidan con el ID del vehículo
    const historial = inspecciones.filter(insp => insp.vehiculoId === vehiculoId);
    
    res.json(historial);
});

// POST /api/Inspecciones -> Registrar una nueva inspección
app.post('/api/Inspecciones', (req, res) => {
    const nuevaInspeccion = {
        id: idInspeccionActual++,
        vehiculoId: req.body.vehiculoId,
        fecha: req.body.fecha,
        resultado: req.body.resultado,
        observaciones: req.body.observaciones
    };
    inspecciones.push(nuevaInspeccion);
    res.status(201).json(nuevaInspeccion);
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
});