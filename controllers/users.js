// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

//mount our routes on the router

//GET /users/new -- serves a form to create a new user
router.get('/new', (req,res) => {
    res.render('users/new.ejs', {
        user: res.locals.user
    })
})
//POST /users -- creates a new user from the form @ /users/new
router.post('/', async (req, res) => {
    try{
        //based on the info in the req.body, find or create user
        const [newUser, created] = await db.user.findOrCreate({
            where:{
                email: req.body.email
            }
        })
        //if user is found, redirect user to login
        if (!created) {
            console.log('User exists!')
            res.redirect('/users/login?message=Please log in to continue.')
        } else {
            //here we know it is a new user 
            //hash the supplised password
            const hashedPassword = bcrypt.hashSync(req.body.password, 12)
            newUser.password = hashedPassword
            //save the user with the new password 
            await newUser.save() //actually saves the new password in the db 
            //encrypt the new user's id and convert to string
            const encryptedId = crypto.AES.encrypt(String(newUser.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            //place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            //redirect to user's profile 
            res.redirect('/users/profile') 
        }
    } catch(err){
        console.log(err)
        res.status(500).send('Server error')
    }
})

//GET /users/login -- render a login form that POSTs to /users/login
router.get('/login', (req,res) => {
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null,
        user: res.locals.user 
    })
})

//POST /users/login -- ingest data from form rendered @ GET /users/login
router.post('/login', async(req,res) => {
    try{
        //look up the user based on their email 
        const user = await db.user.findOne({
            where: {
                email: req.body.email 
            }
        })
        //boilerplate message if login fails
        const badCredentialMessage = 'Incorrect username or password'
        if (!user) {
            //if the user isn't found in the db 
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
            //if the user's supplied password is incorrect
            res.redirect('/users/login?message=' + badCredentialMessage)
        } else {
            //if the user if found and their password matches log them in
            console.log('logging user in')
            //encrypt the new user's id and convert to string
            const encryptedId = crypto.AES.encrypt(String(user.id), process.env.SECRET)
            const encryptedIdString = encryptedId.toString()
            //place the encrypted id in a cookie
            res.cookie('userId', encryptedIdString)
            res.redirect('/users/profile')
        }
    } catch(error){
        console.log(err)
        res.status(500).send('Server error')
    }
})

//GET /users/logout -- clear any cookies and redirect to the homepage 
router.get('/logout', (req,res) => {
    //log the user our by removing the cookie
    //make a get req to /
    res.clearCookie('userId')
    res.redirect('/')
})

//GET /users/profile -- show the user their profile page
router.get('/profile', (req, res) => {
    //if the user is not logged in -- not allowed to be here
    if (!res.locals.user) {
        res.redirect('/user/login?message=You must be logged in to view this page')
    } else {
        res.render('users/profile.ejs', {
            user: res.locals.user
        })
    }
})

// ------ FAVORITES routes start ------

//POST user/faves - CREATE receive the name of the cocktail and add it to database
router.post('/favorites', async (req, res) => {
    // console.log(req.body.name)
    try{
        // console.log(req.body.name)
        await db.favorite.findOrCreate({
            where: {
                name: req.body.name,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions 
                // add userId input from models here?
            }
        })
        res.redirect(req.get('referer'))    
    } catch(error) {
        console.log(error.message)
        res.status(500).send('Server error :(')
    }
})

//GET user/faves - READ return a page with favorited cocktails
router.get('/favorites', async(req,res) => {
    try{
        // READ function to find all favorited cocktails
        const faveCocktails = await db.favorite.findAll()
        res.render('users/faves', {
            favedResults: faveCocktails
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send(':( Server error')
    }
})

//GET user/faves - UPDATE 
// :( no update function yet 

//DELETE user/faves - removes a favorite from the favorites list 
router.delete('/favorites/:id', async (req,res) => {
    // console.log(`This is the req.params.id: ${req.params.id}`)
    try{
        //remove the cocktail recipe indicated by the req.params from array
        const deleteFave = await db.favorite.destroy({
            where: {
                id: req.params.id
            },
        })
        res.redirect(req.get('referer'))  
    } catch(error) {
        console.log(error.message)
        res.status(500).send('Server error :(')
    }
})

//----- COMMENTS routes start ------


//export the router
module.exports = router 