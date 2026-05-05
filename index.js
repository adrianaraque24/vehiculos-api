const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite recibir JSON en el cuerpo de la petición

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vehículos API',
            version: '1.0.0',
            description: 'API para la gestión de vehículos e inspecciones',
        },
    },
    apis: ['./index.js'], // Archivo donde buscará la documentación
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * /api/Vehiculos:
 *   get:
 *     summary: Obtener todos los vehículos
 *     tags: [Vehiculos]
 *     responses:
 *       200:
 *         description: Lista de todos los vehículos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
// 1. GET /api/Vehiculos -> Obtener todos los vehículos
app.get('/api/Vehiculos', (req, res) => {
    res.json(vehiculos);
});

/**
 * @swagger
 * /api/Vehiculos/{id}:
 *   get:
 *     summary: Obtener un vehículo específico por ID
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo a buscar
 *     responses:
 *       200:
 *         description: Datos del vehículo
 *       404:
 *         description: Vehículo no encontrado
 */
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

/**
 * @swagger
 * /api/Vehiculos:
 *   post:
 *     summary: Crear un nuevo vehículo
 *     tags: [Vehiculos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               placa:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
 */
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

/**
 * @swagger
 * /api/Vehiculos/{id}:
 *   put:
 *     summary: Actualizar un vehículo
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo a actualizar
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               placa:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehículo actualizado
 *       404:
 *         description: Vehículo no encontrado
 */
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

/**
 * @swagger
 * /api/Vehiculos/{id}:
 *   delete:
 *     summary: Eliminar un vehículo
 *     tags: [Vehiculos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo a eliminar
 *     responses:
 *       200:
 *         description: Vehículo eliminado exitosamente
 *       404:
 *         description: Vehículo no encontrado
 */
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

/**
 * @swagger
 * /api/Inspecciones:
 *   get:
 *     summary: Obtener todas las inspecciones
 *     tags: [Inspecciones]
 *     responses:
 *       200:
 *         description: Lista de todas las inspecciones de todos los vehículos
 */
// GET /api/Inspecciones -> Obtener TODAS las inspecciones de todos los vehículos
app.get('/api/Inspecciones', (req, res) => {
    res.json(inspecciones);
});

/**
 * @swagger
 * /api/Inspecciones/vehiculo/{id}:
 *   get:
 *     summary: Obtener las inspecciones de un vehículo específico
 *     tags: [Inspecciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del vehículo vinculado a las inspecciones
 *     responses:
 *       200:
 *         description: Lista de inspecciones del vehículo
 */
// GET /api/Inspecciones/vehiculo/:id -> Obtener las inspecciones de UN vehículo en específico
app.get('/api/Inspecciones/vehiculo/:id', (req, res) => {
    const vehiculoId = parseInt(req.params.id);
    
    // Filtramos para devolver solo las inspecciones que coincidan con el ID del vehículo
    const historial = inspecciones.filter(insp => insp.vehiculoId === vehiculoId);
    
    res.json(historial);
});

/**
 * @swagger
 * /api/Inspecciones:
 *   post:
 *     summary: Registrar una nueva inspección
 *     tags: [Inspecciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehiculoId:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               resultado:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inspección registrada exitosamente
 */
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