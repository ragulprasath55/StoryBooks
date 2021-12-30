const express = require('express')
const req = require('express/lib/request')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Story = require('../models/story')

// Login/landing page
router.get('/', ensureGuest, (req, res) => {
    res.render("login", {
        layout: 'login'
    })
})

//dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()//lean() returns objects instead of mongoose docs which we need to render in front
        res.render("dashboard", {
            name: req.user.firstName,
            stories
        })
    } catch (error) {
        console.error(err)
        res.render('error/500.hbs')
    }

})

router.get('/test', ensureAuth, async (req, res) => {
    try {
        res.render('test')
    } catch (error) {
        console.error(err)
        res.render('error/500.hbs')
    }

})

module.exports = router