require('dotenv').config()
const Phonebook = require('./models/phonenbook')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('build'))

morgan.token('type', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.json())

app.post('/api/persons', (request, response, next) => {
  let body = request.body

  if(!body.name || !body.number){
    return response.status(400).json({
      error: 'name or number is missing'
    }).end()
  }

  // if(persons.find(p => p.name === body.name)){
  //     return response.status(409).json({
  //         error: 'name must be unique'
  //     }).end()
  // }

  const phonebook = new Phonebook({
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    name: body.name,
    number: body.number
  })

  // persons = persons.concat(person)
  // response.json(person)
  phonebook.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const phonebook = {
    name: body.name,
    number: body.number,
  }

  Phonebook.findByIdAndUpdate(request.params.id, phonebook, { new: true, runValidators: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Phonebook.find({}).then(phoneboook => {
    response.send(
      `Phonebook has info for ${phoneboook.length} people`+
            '<br/>' +
            new Date().toString()
    )
  })
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(phonebook => {
    response.json(phonebook)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then(phonebook => {
      if(phonebook) {
        response.json(phonebook)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phonebook.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})