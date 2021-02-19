const express = require('express')
const { registrarLibro, obtenerLibros, borrarLibro, obtenerLibro, actualizarLibro } = require('../controllers/libro.controller')

const router = express.Router()

router
  .route('/')  
  .get(obtenerLibros)
  .post(registrarLibro)

  router
  .route('/:id')  
  .get(obtenerLibro)
  .put(actualizarLibro)
  .delete(borrarLibro)

  module.exports = router