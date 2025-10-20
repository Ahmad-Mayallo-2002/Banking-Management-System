import { log } from 'console';
import { config } from 'dotenv';
import passport from 'passport';
import {
  GoogleCallbackParameters,
  Profile,
  Strategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Request } from 'express';

config();

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      passReqToCallback: true, // Enables access to raw response
    },
    async function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      params: GoogleCallbackParameters,
      profile: Profile,
      done: VerifyCallback,
    ) {
      const idToken = params.id_token;
      const user = { profile, accessToken, refreshToken, idToken };
      return done(null, user);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  return done(null, id as Express.User);
});
