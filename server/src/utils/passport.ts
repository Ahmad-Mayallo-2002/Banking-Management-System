import { log } from 'console';
import { config } from 'dotenv';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';

config();

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    function (accessToken, refreshToken, profile, done) {
      log(accessToken);
      log(refreshToken);
      log(profile);
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  return done(null, { id });
});
