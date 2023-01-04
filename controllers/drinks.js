// create an instance of express routers
const express = require('express')
const db = require('../models')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const axios = require('axios')
const API_KEY = process.env.API_KEY

//----- COMMENTS routes start ------
router.get('/:name', async (req, res) => {
    // res.send('hello this is the details and comments page')
    // db.comment.findOne({
    //     where: {id: req.params.id},
    //     include: [db.user, db.comment]
    // })
    try{
        // const comments = await db.comment.findAll()
        let name = req.body.name
        let id = req.params.name 
        const url = `https://api.api-ninjas.com/v1/cocktail?name=${name}/drinks/:${id}`
        const config = { headers: { 'X-Api-Key': API_KEY}} 
        const details = await axios.get(url,config)
        res.render('drinks.ejs', {
            display: details.data     
        })
        console.log(details)
    } catch(error) {
        console.log(error.message)
        res.status(500).send('Server Error 💬')
    }
})

router.post('/:id/comment', async (req, res) => {
    try{
        const userComment = await db.comment.create({
            userName: req.body.name,
            comment: req.body.content 
        })
        
    }catch(error){
        console.log(error.message)
        res.status(500).send('💬 Comments Posting Server Error')
    }
})

//export the router
module.exports = router 