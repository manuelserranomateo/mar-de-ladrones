const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Strategy } = require('@superfaceai/passport-twitter-oauth2');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    // sustituir por los credenciales de google
    clientID: "xxxxxx",
    clientSecret: "xxxxxxx",
    callbackURL: "xxxxxxx"
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(
    new Strategy(
      {
        // sustituir por los credenciales de twitter developers (la twitter API empieza a ser de pago a partir de 12/02/2023)
        clientID: 'xxxxxxx',
        clientSecret: 'xxxxxxx',
        clientType: 'xxxxxxx',
        callbackURL: "xxxxxxx"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('Success!', { accessToken, refreshToken });
        return done(null, profile);
      }
    )
  );

