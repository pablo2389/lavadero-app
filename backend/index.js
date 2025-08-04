const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Ruta raíz
app.get('/', (req, res) => {
  res.send("¡Servidor Express corriendo!");
});

// Ruta que el frontend necesita
app.get('/api/mensaje', (req, res) => {
  res.json({ mensaje: 'Hola desde backend en Render!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
