// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

//----- COMMENTS routes start ------
router.get('/', async (req, res) => {
    // res.send('hello this is the details and comments page')
    try{
        const comments = await db.comment.findAll()
        const faveCocktails = await db.favorite.findAll()
        res.render('drinks.ejs', {
            where: {
                commentContent: comments, 
                favedResults: faveCocktails
            }
        })
    } catch(error) {
        console.log(error.message)
        res.status(500).send('Server Error 💬')
    }
})

router.post('/:id', async (req, res) => {
    try{
        await db.comment.findOrCreate()
    }catch(error){
        console.log(error.message)
        res.status(500).send('💬 Server Error ')
    }
})

//export the router
module.exports = router 