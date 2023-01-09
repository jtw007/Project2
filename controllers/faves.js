// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')

// --------- FAVORITES routes start ------------

//POST user/faves - CREATE receive the name of the cocktail and add it to database
router.post('/', async (req, res) => {
    // console.log(req.body.name)
    try{
        // console.log(req.body.name)
        await db.favorite.findOrCreate({
            where: {
                name: req.body.name,
                ingredients: req.body.ingredients,
                instructions: req.body.instructions, 
                userId: res.locals.user.id
            }
        })
        res.redirect(req.get('referer'))  
    } catch(error) {
        console.log(error.message)
        res.status(500).send('Server error 📬')
    }
})

//GET user/faves - READ return a page with favorited cocktails
router.get('/', async(req,res) => {
    try{
        // READ function to find all favorited cocktails
        const faveCocktails = await db.favorite.findAll()
        // let ingredients = faveCocktails[0].dataValues.ingredients 
        // console.log(ingredients)
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
router.delete('/:id', async (req,res) => {
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
        res.status(500).send('Server error 🥲')
    }
})



module.exports = router 