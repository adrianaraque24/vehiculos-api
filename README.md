# Documentación de la API de Vehículos

Esta es una API RESTful para la gestión de vehículos. Está construida con Node.js y Express.

**URL Base:** `https://vehiculos-api-pifu.onrender.com`

---

## Endpoints

### 1. Obtener todos los vehículos
Obtiene una lista de todos los vehículos registrados.

* **URL:** `/api/Vehiculos`
* **Método HTTP:** `GET`
* **Respuesta Exitosa (200 OK):**
  ```json
  [
    {
      "id": 101,
      "marca": "Toyota",
      "modelo": "Corolla",
      "placa": "IBA-4521"
    },
    {
      "id": 102,
      "marca": "Nissan",
      "modelo": "Sentra",
      "placa": "PCC-1234"
    }
  ]
  ```

---

### 2. Obtener un vehículo específico
Busca y retorna la información de un vehículo en base a su ID.

* **URL:** `/api/Vehiculos/:id`
* **Método HTTP:** `GET`
* **Parámetros de URL:** `id` (Ejemplo: `/api/Vehiculos/101`)
* **Respuesta Exitosa (200 OK):**
  ```json
  {
    "id": 101,
    "marca": "Toyota",
    "modelo": "Corolla",
    "placa": "IBA-4521"
  }
  ```
* **Respuesta de Error (404 Not Found):**
  ```json
  { "error": "Vehículo no encontrado" }
  ```

---

### 3. Agregar un vehículo nuevo
Crea un nuevo registro de un vehículo en el sistema.

* **URL:** `/api/Vehiculos`
* **Método HTTP:** `POST`
* **Cuerpo de la petición (JSON):**
  ```json
  {
    "marca": "Honda",
    "modelo": "Civic",
    "placa": "XYZ-9876"
  }
  ```
* **Respuesta Exitosa (201 Created):**
  ```json
  {
    "id": 103,
    "marca": "Honda",
    "modelo": "Civic",
    "placa": "XYZ-9876"
  }
  ```

---

### 4. Actualizar un vehículo
Actualiza la información de un vehículo existente. Solo necesitas enviar los campos que deseas modificar.

* **URL:** `/api/Vehiculos/:id`
* **Método HTTP:** `PUT`
* **Parámetros de URL:** `id` (Ejemplo: `/api/Vehiculos/101`)
* **Cuerpo de la petición (JSON) - Opcional:**
  ```json
  {
    "modelo": "Yaris"
  }
  ```
* **Respuesta Exitosa (200 OK):** Retorna el vehículo con los datos modificados.
  ```json
  {
    "id": 101,
    "marca": "Toyota",
    "modelo": "Yaris",
    "placa": "IBA-4521"
  }
  ```
* **Respuesta de Error (404 Not Found):**
  ```json
  { "error": "Vehículo no encontrado para actualizar" }
  ```

---

### 5. Eliminar un vehículo
Elimina un vehículo del sistema de manera permanente.

* **URL:** `/api/Vehiculos/:id`
* **Método HTTP:** `DELETE`
* **Parámetros de URL:** `id` (Ejemplo: `/api/Vehiculos/101`)
* **Respuesta Exitosa (200 OK):** 
  *(No retorna contenido, solo el código de estado 200 HTTP).*
* **Respuesta de Error (404 Not Found):**
  ```json
  { "error": "Vehículo no encontrado para eliminar" }
  ```

---

## Ejemplos de uso directo (Frontend / JavaScript)

**Ejemplo de una petición GET (Obtener todos los vehículos):**
```javascript
fetch('https://vehiculos-api-pifu.onrender.com/api/Vehiculos')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Ejemplo de una petición POST (Crear vehículo nuevo):**
```javascript
fetch('https://vehiculos-api-pifu.onrender.com/api/Vehiculos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    marca: 'Ford',
    modelo: 'Fiesta',
    placa: 'DEF-4321'
  })
})
.then(response => response.json())
.then(data => console.log('Vehículo creado:', data));
```
