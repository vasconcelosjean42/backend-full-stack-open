const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log(url)

mongoose.connect(url)
  .then(() => {
    console.log('conected to MongoDB')
  }).catch(error => {
    console.log('error connectiong to MongoDB:', error.message)
  })

const phonebookSchema  = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: v => /^\d{2,3}-\d+$/.test(v),
      message:  ({ value }) => `${value} is not a valid phone number`
    }
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Phonebook', phonebookSchema)