import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GithubStrategy } from 'passport-github2'
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

    passport.use(
        new GithubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID || '',
                clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
                callbackURL: `${process.env.CALL_BACK_URL}/api/v1/auth/github/callback`,
            },
            async function (
                accessToken: string,
                refreshToken: string,
                profile: any,
                done: (error: any, user?: any) => void,
            ) {
                const res = await fetch('https://api.github.com/user/emails', {
                    headers: {
                        Authorization: `token ${accessToken}`,
                    },
                });
                const data: any[] = await res.json();
                const primaryEmail = data.find((item) => item.primary === true);

                const user = await db.user.upsert({
                    create: {
                        email: primaryEmail!.email,
                        name: profile.displayName,
                        provider: 'github',
                    },
                    update: {
                        name: profile.displayName,
                    },
                    where: {
                        email: primaryEmail?.email,
                    },
                });

                done(null, user);
            },
        ),
    );
}