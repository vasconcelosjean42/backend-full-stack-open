const mongoose = require('mongoose')

if(process.argv.length<3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@phonebook.rngmcxx.mongodb.net/phonebook?retryWrites=true&w=majority`
    
mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema  = new mongoose.Schema({
    name: String,
    number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

if(process.argv.length == 3){
    Phonebook.find({}).then(result => {
        result.forEach(phone => {
            console.log(phone)
        })
        mongoose.connection.close()
    })
}else{
    const name = process.argv[3]
    const number = process.argv[4]
    
    const phonebook = new Phonebook({
        name: name,
        number: number,
    })
    
    phonebook.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}