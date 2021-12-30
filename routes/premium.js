const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const User = require('../models/user')
// Login/landing page
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, {
            access: 'premium'
        })

        console.log(user);
        res.redirect('/promote')

    } catch (error) {

    }
})

module.exports = router