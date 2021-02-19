const supertest = require('supertest')
const mongoose  = require('mongoose')
const Libro = require('../models/libro.model')

const host = "http://localhost:5000/api"
const db   = 'jest'
const url  = `mongodb://127.0.0.1/${db}`
const request = supertest(host)
const libroId = "56955ca46063c5600627f393"
const libroIdNoValido = "56955ca46063c5600627f392"

const options = {
    useNewUrlParser : true,
    useCreateIndex  : true,
    useFindAndModify  : false,
    useUnifiedTopology: true
}

beforeEach(async () => {     
    await mongoose.connect(url, options)           
    await Libro.deleteMany()  
    
    const libro = {   
        _id      : libroId,
        titulo   : "titulo 1",
        tema     : "tema 1",
        idioma   : "idioma 1",
        paginas  : 560,
        publicado: 2021
    }    
    
    await Libro.create(libro)          
    await mongoose.disconnect()
})

it("debe devolver todos los libros", async function () {
    const response = await request.get("/libros")                    
    
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('success')
    expect(response.body.count).toBe(1)
    expect(response.body.count).not.toBeNull()
    expect(response.body.data).not.toBeNull()
})

it("debe devolver un libro", async function () {
    const response = await request.get(`/libros/${libroId}`)                    
    
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('success')      
})

it("debe devolver un error 404 si buscamos un libro que no existe", async function () {
    const response = await request.get(`/libros/${libroIdNoValido}`)                    
    
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')      
})

it("debe devolver un error 404 si buscamos un libro cuyo ID no es un ObjectId valido", async function () {
    const response = await request.get('/libros/1')
    
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')      
})


it("debe registrar un nuevo libro", async function () {
    const libro = {
        titulo   : "titulo 1999",
        tema     : "NodeJS",
        idioma   : "es",
        paginas  : 560,
        publicado: 2021
    }

    const response = await request.post("/libros").send(libro)  

    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('success')
    expect(response.body.message).toBe('Libro registrado con exito')
    expect(response.body.data.libro.titulo).toBe(libro.titulo)
})

it("debe devolver un error 400 al registrar un libro sin titulo", async function () {
    const libro = {
        tema     : "NodeJS",
        idioma   : "es",
        paginas  : 560,
        publicado: 2020
    }

    const response = await request.post("/libros").send(libro)  

    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('error')      
})

it("debe borrar un libro", async function () {
    const response = await request.delete(`/libros/${libroId}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('success')      
})

it("debe devolver un error 404 al borrar un libro que no existe", async function () {
    const response = await request.delete(`/libros/${libroIdNoValido}`)

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')      
})

it("debe devolver un error 404 al borrar un libro que no existe con un ID mal formado", async function () {
    const response = await request.delete(`/libros/1`)

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')      
})

it("debe actualizar un libro", async function () {
    const response = await request.put(`/libros/${libroId}`).send({
        titulo   : "titulo 1 updated",
        tema     : "tema 1",
        idioma   : "idioma 1",
        paginas  : 560,
        publicado: 2021
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('success')      
})

it("debe un error 404 al actualizar un libro que no existe", async function () {
    const response = await request.put(`/libros/${libroIdNoValido}`).send({
        titulo   : "titulo 1 updated",
        tema     : "tema 1",
        idioma   : "idioma 1",
        paginas  : 560,
        publicado: 2021
    })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')      
})

it("debe un error 404 al actualizar un libro con un ID mal formado", async function () {
    const response = await request.put(`/libros/1`).send({
        titulo   : "titulo 1 updated",
        tema     : "tema 1",
        idioma   : "idioma 1",
        paginas  : 560,
        publicado: 2021
    })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('error')      
})

