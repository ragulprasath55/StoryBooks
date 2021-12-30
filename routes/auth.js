const express = require('express')
const passport = require('passport')
const router = express.Router()

// Auth with google
router.get('/google',passport.authenticate('google',{scope : ['profile']}))

//google auth callback 
router.get('/google/callback',passport.authenticate('google',{failureRedirect : '/'}), (req,res) => {
    res.redirect('/dashboard')
})

//logout user
router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect("/")
})

module.exports=router