
const mongoose = require('mongoose')

const conectarDB = () => {
 mongoose.connect("mongodb://localhost:27017/jest", {
    useNewUrlParser : true,
    useCreateIndex  : true,
    useFindAndModify  : false,
    useUnifiedTopology: true
  })
  .then(() => {})
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })  
}

module.exports = conectarDB