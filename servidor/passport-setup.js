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
    // Para local
    // clientID: "1083000602751-kls56inde63ce9q07ucb6qum2kr1366n.apps.googleusercontent.com",
    // clientSecret: "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",
    // callbackURL: "http://localhost:3000/google/callback"

    // Para despliegue
    clientID: "1083000602751-vmahtj42p8kgduisvvakus8f0aagvin2.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://proyecto22-y3e2t6nkdq-no.a.run.app/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.use(
    new Strategy(
      {
        clientID: 'OTlJaVBwdVVvNDIxekxrczB2cnY6MTpjaQ',
        clientSecret: 'ES4UBpXdxON8A1TMxXkvYDsJtf5f32gQ3KF-pp2NXzRlLKIog9',
        clientType: 'confidential',
        // Para local
        // callbackURL: 'http://localhost:3000/auth/twitter/callback',

        // Para despliegue
        callbackURL: "https://proyecto22-y3e2t6nkdq-no.a.run.app/auth/twitter/callback"
      },
      (accessToken, refreshToken, profile, done) => {
        console.log('Success!', { accessToken, refreshToken });
        return done(null, profile);
      }
    )
  );

