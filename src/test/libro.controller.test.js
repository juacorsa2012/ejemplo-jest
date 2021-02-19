const httpMocks  = require('node-mocks-http')
const controller = require('../controllers/libro.controller')
const model  = require('../models/libro.model')
const libros = require('./mocks/libros.json')
const libro  = require('./mocks/libro.json')

/*
model.findById = jest.fn()
model.create   = jest.fn()
model.find     = jest.fn()
model.findByIdAndRemove = jest.fn()
model.findByIdAndUpdate = jest.fn()*/

jest.mock('../models/libro.model')

let req, res
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
})

describe("obtenerLibro", () => {
    test("obtenerLibro es una funcion definida", () => {
        expect(typeof controller.obtenerLibro).toBe("function")
    })

    test("debe devolver un libro con un codigo 200", async () => {
        req.params.id = libros[0]._id
        model.findById.mockReturnValue(libros[0])    
        await controller.obtenerLibro(req, res)       
        expect(model.findById).toHaveBeenCalledWith(req.params.id)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData().status).toBe('success')
        expect(res._getJSONData().data.libro).toStrictEqual(libros[0])
        expect(res._isEndCalled()).toBeTruthy()          
    })

    test("debe devolver un error 404 cuando el libro no existe", async () => {
        req.params.id = libros[0]._id
        model.findById.mockReturnValue(null)
        await controller.obtenerLibro(req, res)
        expect(model.findById).toHaveBeenCalledWith(req.params.id)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData().status).toBe('error')
        expect(res._getJSONData().message).toBe('Libro no encontrado')
        expect(res._isEndCalled()).toBeTruthy()  
    })
})

describe("obtenerLibros", () => {
    test("obtenerLibros es una funcion definida", async () => {
        expect(typeof controller.obtenerLibros).toBe("function")
    })

    test("debe existir una llamada a model.find({})", async () => {
        await controller.obtenerLibros(req, res)
        expect(model.find).toHaveBeenCalledWith({})
    })

    test("debe devolver todos los libros y responder con statusCode de 200", async () => {
        model.find.mockReturnValue(libros)
        await controller.obtenerLibros(req, res)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData().status).toBe('success')
        expect(res._getJSONData().count).toBe(libros.length)
        expect(res._getJSONData().data.libros).toStrictEqual(libros)
        expect(res._isEndCalled()).toBeTruthy()  
    })

    test("debe devolver un error 500 cuando se produce una excepción", async () => {
        model.find.mockRejectedValue("error")
        await controller.obtenerLibros(req, res)
        expect(res.statusCode).toBe(500)
        expect(res._getJSONData().status).toBe('error')
        expect(res._getJSONData().message).toBe('Ha sido imposible completar la accion solicitada')
        expect(res._getJSONData().error).toBeDefined()
        expect(res._isEndCalled()).toBeTruthy()     
    })
})

describe("registrarLibro", () => {
    test("registrarLibro es una funcion definida", () => {
        expect(typeof controller.registrarLibro).toBe("function")
    })

    test("debe registrar un nuevo libro y devolver un statusCode de 200", async () => {
        req.body = libro
        model.create.mockReturnValue(libro)
        await controller.registrarLibro(req, res)
        expect(res.statusCode).toBe(201)
        expect(res._getJSONData().status).toBe('success')
        expect(res._getJSONData().message).toBe('Libro registrado con exito')
        expect(res._getJSONData().data.libro).toStrictEqual(libro)   
    })

    test("debe devolver un statusCode de 400 si se produce una excepcion", async () => {
        model.create.mockRejectedValue("error")
        await controller.registrarLibro(req, res)         
        expect(res.statusCode).toBe(400)
    })
})

describe("borrarLibro", () => {
    test("borrarLibro es una funcion definida", () => {
        expect(typeof controller.borrarLibro).toBe("function")
    })

    test("debe borrar un libro y devolver un statusCode 200", async () => {
        req.params.id = libros[0]._id
        model.findByIdAndRemove.mockReturnValue({
            status : 'success',
            message: 'Libro borrado con exito'
        })
        
        await controller.borrarLibro(req, res)    
        expect(model.findByIdAndRemove).toHaveBeenCalledWith(req.params.id)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData().status).toBe('success')
        expect(res._getJSONData().message).toBe('Libro borrado con exito')
        expect(res._isEndCalled()).toBeTruthy()          
    })

    test("debe devolver un statusCode 404 al borrar un libro que no existe", async () => {
        req.params.id = libros[0]._id
        model.findByIdAndRemove.mockReturnValue(null)
            
        await controller.borrarLibro(req, res)    
        expect(model.findByIdAndRemove).toHaveBeenCalledWith(req.params.id)
        expect(res.statusCode).toBe(404)
        expect(res._getJSONData().status).toBe('error')
        expect(res._getJSONData().message).toBe('Libro no encontrado')
        expect(res._isEndCalled()).toBeTruthy()          
    })

    test("debe devolver un statusCode 500 si se lanza una excepción", async () => {
        req.params.id = libros[0]._id
        model.findByIdAndRemove.mockRejectedValue("error")
            
        await controller.borrarLibro(req, res)    
        expect(model.findByIdAndRemove).toHaveBeenCalledWith(req.params.id)
        expect(res.statusCode).toBe(500)
        expect(res._getJSONData().status).toBe('error')
        expect(res._getJSONData().message).toBe('Ha sido imposible completar la accion solicitada')    
        expect(res._isEndCalled()).toBeTruthy()              
    })
})

describe("actualizarLibro", () => {
    test("actualizarLibro es una funcion definida", () => {
        expect(typeof controller.actualizarLibro).toBe("function")
    })

    test("debe actualizar un libro con los parametros correctos", async () => {
        req.params.id = libros[0]._id
        req.body = libro
        await controller.actualizarLibro(req, res)

        expect(model.findByIdAndUpdate).toHaveBeenCalledWith(libros[0]._id, libro, {
            new: true,
            runValidators: true
        })   
    })

    test("debe actualizar un libro y devolver un statusCode de 200", async () => {
        req.params.id = libros[0]._id
        req.body = libro
        model.findByIdAndUpdate.mockReturnValue(libro)
        await controller.actualizarLibro(req, res)
        expect(res._isEndCalled()).toBeTruthy()    
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData().status).toBe('success')
        expect(res._getJSONData().message).toBe('Libro actualizado con exito')
        expect(res._getJSONData().data.libro).toStrictEqual(libro)
    })

    test("debe devolver un statusCode de 404 al actualizar un libro que no existe", async () => {
        req.params.id = libros[0]._id
        req.body = libro
        model.findByIdAndUpdate.mockReturnValue(null)
        await controller.actualizarLibro(req, res)
        expect(res._isEndCalled()).toBeTruthy()    
        expect(res.statusCode).toBe(404)      
        expect(res._getJSONData().status).toBe('error')
        expect(res._getJSONData().message).toBe('Libro no encontrado')
    })

    test("should handle errors", async () => {
        req.params.id = libros[0]._id
        req.body = libro
        model.findByIdAndUpdate.mockRejectedValue("error")
        await controller.actualizarLibro(req, res)
        expect(res.statusCode).toBe(500)
    })
})