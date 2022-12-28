const express = require('express');
const router = express.Router();
const db = require('../models')
const axios = require('axios')
const API_KEY = process.env.API_KEY

//GET /cocktail - return a page with favorited cocktails
router.get('/', async(req,res) => {
    try{
        // READ function to find all favorited cocktails
        const faveCocktails = await db.cocktail.findAll()
        res.render('faves.ejs', {
            favedResults: faveCocktails
        })
    }catch(error){
        console.log(error.message)
        res.status(500).send(':( API error')
    }
})

//POST /cocktail - receive the name of the cocktail and add it to database
router.post('/', async (req, res) => {
    // console.log(req.body.name)
    try{
    await db.cocktail.findOrCreate({
        where: {
            name: req.body.name
        }
    })
    } catch(error){
        console.log(error.message)
        res.status(500).send('API error')
    }
    res.redirect('./users/favorites')    
})

//add GET ROUTE to render show page that pulls info from api provided
router.get('/:name', async(req,res) => {
    try{
        const url = `https://api.api-ninjas.com/v1/cocktail?name=${req.params.name}`
        const config = { headers: { 'X-Api-Key': API_KEY}} 
        // console.log(url)
        // res.json(response.data)
        const response = await axios.get(url,config)
        res.render('faves.ejs', {
            favedResults: response.data,
            name: req.params.name,
            user: res.locals.user
        })
    } catch(error){
        console.log(error.message)
        res.status(500).send('API error :(')
    }
})
// REMEMBER TO EXPORT MODELS
module.exports = router