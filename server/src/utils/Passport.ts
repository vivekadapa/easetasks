import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma as db } from './dbConnect';

export const initPassport = () => {

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user as any);
    });

    // Configure Google strategy
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: `${process.env.CALL_BACK_URL}/api/v1/auth/google/callback`,
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {

            console.log(profile);
            const user = await db.user.upsert({
                create: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0].value,
                    provider: 'google',
                },
                update: {
                    name: profile.displayName,
                    avatar: profile.photos[0].value,
                },
                where: {
                    email: profile.emails[0].value
                }
            })
            console.log(user);
            return done(null, user);
        } catch (error) {
            console.log(error);
        }
    }));
}