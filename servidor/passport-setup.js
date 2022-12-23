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

passport.use(
    new TwitterStrategy(
      {
        clientType: 'confidential',
        clientID: 'QXZUUk9TT3BjWngyaEJycm1EMnE6MTpjaQ',
        clientSecret: '2UbS4xSbmjJRVS71WVq1B8WImKePxyHc-9Bi9v9k-l-FPjv36q',
        callbackURL: 'https://proyecto22-y3e2t6nkdq-no.a.run.app/auth/twitter/callback',
      },
      function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
          return done(err, user);
        // });
      }
    )
  );