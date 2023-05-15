const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(url)

mongoose.connect(url)
    .then(result => {
        console.log('conected to MongoDB')
    }).catch(error => {
        console.log('error connectiong to MongoDB:', error.message)
    })

const phonebookSchema  = new mongoose.Schema({
    name: String,
    number: String,
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)