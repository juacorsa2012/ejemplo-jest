const mongoose = require('mongoose')

const libroSchema = new mongoose.Schema(
{
	titulo: {
    type: String,
    required: [true, 'titulo oblogatorio'],
    trim: true
  },

  observaciones: String, 

  tema: {
    type: String,    
    required: [true, 'tema oblogatorio'],
  },

  idioma: {
    type: String,    
    required: [true, 'idioma oblogatorio'],
  },

  paginas: {
    type: Number,
    required: [true, 'paginas oblogatorio'],
    min: [1, 'paginas minimo una']
  },

  publicado: {
    type: Number,
    required: [true, 'publicado oblogatorio'],
    min: [2005, 'año 2005 como minimo']
  },

  created_at: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

const Libro = mongoose.model('Libro', libroSchema, 'libros')

module.exports = Libro