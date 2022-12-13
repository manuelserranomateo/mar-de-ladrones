const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
    //console.log(user);
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    //User.findById(id, function(err, user) {
    done(null, user);
    //});
});

passport.use(new GoogleStrategy({
    clientID: "1083000602751-kls56inde63ce9q07ucb6qum2kr1366n.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
        //});
    }
));
