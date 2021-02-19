const app = require('./app')
const conectarDB = require('./config/db')

const PORT = process.env.PORT || 5000

conectarDB()

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`)
})


console.log(process.env.NODE_ENV)

exports.module = server