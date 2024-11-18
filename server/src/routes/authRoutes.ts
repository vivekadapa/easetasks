
import express from "express"
import { verify, refresh, logout } from "../controllers/AuthController"
import verifyToken from "../middleware/auth";
import passport from "passport";
const router = express.Router()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { successRedirect: process.env.SUCCESS_REDIRECT, failureRedirect: `${process.env.SUCCESS_REDIRECT}/landing` }));
router.get(
    '/github',
    passport.authenticate('github', { scope: ['read:user', 'user:email'] }),
  );
  
  router.get(
    '/github/callback',
    passport.authenticate('github', {
      successRedirect: process.env.SUCCESS_REDIRECT,
      failureRedirect: `${process.env.SUCCESS_REDIRECT}/landing`,
    }),
  );
router.get('/logout', logout);
router.get('/refresh', refresh)
router.get('/verify', verifyToken, verify)


export default router;