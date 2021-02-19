const ObjectId = require('mongoose').Types.ObjectId
const Libro = require('../models/libro.model')

const registrarLibro = async (req, res) => {    
  try {
    const libro = await Libro.create(req.body)  

    res.status(201).json({
      status : 'success',
      message: 'Libro registrado con exito',
      data   : { libro }
    })           
    
  } catch (err) {        
      //errores = Object.values(err.errors).map(el => el.message)   
      res.status(400).json({
        status: 'error',
        message: 'Ha sido imposible completar la accion solicitada',
        err
      })  
  }      
}

const obtenerLibros = async (req, res) => {
  try {
    const libros = await Libro.find({})

    res.status(200).json({
      status: 'success',      
      count: libros.length,
      data: { libros }
    })        
  } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Ha sido imposible completar la accion solicitada',
        error: err
      })
  }
}

const obtenerLibro = async (req, res) => {  
  try {
    const id = req.params.id
      
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({
        status: 'error',
        message: 'Libro no encontrado'
      })        
    }
  
      const libro = await Libro.findById(id)
  
      if (!libro) {     
        return res.status(404).json({
          status: 'error',
          message: 'Libro no encontrado'
        })        
      }   
           
      res.status(200).json({
        status: 'success',
        data:  {libro}
      })        
  } catch (err) {
  }
} 

const borrarLibro = async (req, res) => {  
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      status: 'error',
      message: 'Libro no encontrado'
    })        
  }

  try {
    const libro = await Libro.findByIdAndRemove(id)

    if (!libro) {
      return res.status(404).json({
        status: 'error',
        message: 'Libro no encontrado'
      })    
    }   

    res.status(200).json({
      status : 'success',
      message: 'Libro borrado con exito'
    })  
  } catch (err) {
    res.status(500).json({
      status : 'error',
      message: 'Ha sido imposible completar la accion solicitada',
      error  : err.message
    })
  }     
}

const actualizarLibro = async (req, res) => {  
  const id = req.params.id   
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).json({
      status: 'error',
      message: 'Libro no encontrado'
    })        
  }   
        
  try {
    const libro = await Libro.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })        

    if (!libro) {     
      return res.status(404).json({ status: 'error', message: 'Libro no encontrado' })        
    }     

    res.status(200).json({
      status: 'success',
      message: 'Libro actualizado con exito',
      data: { libro }
    })           
  } catch (err) {
    //const errores = Object.values(err.errors).map(el => el.message)  
      
    res.status(500).json({
      status: 'error',
      message: 'Ha sido imposible completar la accion solicitada',
      err
    })
  }           
}

module.exports = {
    registrarLibro,
    obtenerLibros,
    obtenerLibro,
    borrarLibro,
    actualizarLibro
}
