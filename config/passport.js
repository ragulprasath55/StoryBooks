const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/user')


module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'//note using relative url like auth/google/callback not working, this link is called when done() is called
    },  async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId:profile.id,
          displayName:profile.displayName,
          firstName : profile.name.givenName,
          lastName : profile.name.familyName,
          image : profile.photos[0].value
        }

        try{
          let user = await User.findOne({googleId:profile.id})

          if(user){
            done(null,user)
          }else{
            user = await User.create(newUser)
            done(null,user)
          }
        }
        catch(err){
          console.error(err)
        }
    })
    )

    //get it from documentation itself
    passport.serializeUser(function(user, done) {
      console.log("Printing the the user in Serialize user");
        console.log(user.id)
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);  
        });
      });
}