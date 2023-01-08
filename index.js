//required packages 
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const db = require('./models')
const crypto = require('crypto-js')
const axios = require('axios')
const API_KEY = process.env.API_KEY
const methodOverride = require('method-override')

//app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')
//parse request bodies from html forms
app.use(express.urlencoded({ extended: false }))
//tell express to parse incoming cookies
app.use(cookieParser())
//enable PUTing and DELETEing from HTML5 forms
app.use(methodOverride('_method'))
//enables public folder to be used
app.use(express.static('public'))



//custom auth middleware that checks the cookies for a user id
//if found, look up the user in the database(db)
//tell all downstream routes about this user
app.use(async (req,res,next) => {
    try {
        if (req.cookies.userId) {
            // decrypt the user id and turn into string
            const decryptedId = crypto.AES.decrypt(req.cookies.userId, process.env.SECRET)
            const decryptedString = decryptedId.toString(crypto.enc.Utf8) 
            //the user is logged in, lets find them in the db 
            const user = await db.user.findByPk(decryptedString)
            //mount the logged in user on the res.locals 
            res.locals.user = user
        } else {
            //set the logged in user to be null for conditional rendering
            res.locals.user = null 
        }

        //move onto the next middleware/route
        next() 
    } catch(error){
        console.log('error in auth middleware: 🥲', error)
        //explictly set user to null if there is error
        next() //go to the next thing
    }
})

//example custom middleware (incoming request logger)
app.use((req,res,next) => {
    // console.log('Hello from the inside of the middleware')
    console.log(`incoming request: ${req.method} - ${req.url}`)
    // res.locals are a place that we can put data to share with 'downstream routes'
    // res.locals.myData = 'hello I am data'
    //invoke next to tell express to go to the next route or middle 
    next()
})


//---ROUTES AND CONTROLLERS-----

//GET data from API 
app.get('/', async(req,res) => {
    try {
        let name = req.query.search
        const url = `https://api.api-ninjas.com/v1/cocktail?name=${name}`
        const config = { headers: { 'X-Api-Key': API_KEY}} 
        const response = await axios.get(url,config)
        // console.log(Object.keys(response.data).length + `🥲`)
        // console.log(response.data)
        if (typeof response.data !== Object) {
            res.render('home.ejs', {
                user: res.locals.user,
                results: response.data
            })
        } else {
            res.send('Invalid search parameters') 
        }
        
    } catch(error){
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥', error.response)
        res.render('home.ejs', {
            user: res.locals.user,
            results: []
        })
        // res.status(500).send('API error')
        // res.send(error.response)
    }
})


//Imports 
app.use('/users', require('./controllers/users'))
app.use('/drinks', require('./controllers/drinks'))


//listening on a port
app.listen(PORT, () => {
    console.log(`Authenticating users on PORT ${PORT}`)
})