//required packages 
require('dotenv').config()
const express = require('express')

//app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
//parse request bodies from html forms
app.use(express.urlencoded({ extended: false }))

//routes and controllers 
app.get('/', (req,res) => {
    res.render('home.ejs')
})

app.use('/users', require('./controllers/users'))

//listening on a port
app.listen(PORT, () => {
    console.log(`Authenticating users on PORT ${PORT}`)
})