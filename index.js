require('dotenv').config()
const Phonebook = require('./models/phonenbook')
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('type', (req, res) => JSON.stringify(req.body))

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :type"))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} people`+
        "<br/>" +
        new Date().toString()
    )
})

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((p => p.id === id))
    if(!person)
        response.status(404).end()
    response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
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
    
    phonebook.save().then(savedNote => {
        response.json(savedNote)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})