const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// Login/landing page
router.get('/', ensureAuth, (req, res) => {
    console.log("User");
    console.log(req.user);
    res.render("promote", {
        user: {
            id: req.user.id,
            access: req.user.access
        }
    })
})

module.exports = router