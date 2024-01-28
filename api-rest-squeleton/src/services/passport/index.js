import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret, masterKey } from '../../config';
import User from '../../api/user/model';
const bcrypt = require("bcrypt")
const argon2 = require("argon2")

// Constantes
const LOCAL_STRATEGY_NAME = 'password';
const MASTER_STRATEGY_NAME = 'master';
const TOKEN_STRATEGY_NAME = 'token';
const USERNAME_FIELD = 'email';
const PASSWORD_FIELD = 'password';

passport.use(LOCAL_STRATEGY_NAME, new LocalStrategy({
  usernameField: USERNAME_FIELD,
  passwordField: PASSWORD_FIELD,
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { CIN } });

    if (!user) {
      return done(null, false, { message: 'Utilisateur non trouvé.' });
    }
    console.log("user password = "+user.password)
    console.log("password = "+password)

    const passwordMatch = user.password.toString()==password.toString()
    if (passwordMatch) {
      console.log("passwordMatch ="+passwordMatch)
      return done(null, {user});
    } else {
      return done(null, false, { message: 'Mot de passe incorrect.' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    return done(error);
  }
}));

passport.use(MASTER_STRATEGY_NAME, new BearerStrategy((token, done) => {
  if (token === masterKey) {
    console.log("token and masterkey are equals");
    done(null, {});
  } else {
    done(null, false);
  }
}));

passport.use(TOKEN_STRATEGY_NAME, new JwtStrategy({
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('access_token'),
    ExtractJwt.fromBodyField('access_token'),
    ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  ]),
}, async ({ CIN }, done) => {
  try {
    const user = await User.findByPk(CIN);
    done(null, user);
  } catch (error) {
    done(error);
  }
}));

export const password = () => (req, res, next) =>
    passport.authenticate(LOCAL_STRATEGY_NAME, { session: false }, (err, user, info) => {
      if (err && err.param) {
        console.error('Validation failed:', err);
        return res.status(400).json({ error: 'Validation failed', details: err });
      } else if (err || !user) {
        console.error('Authentication failed:', err);
        return res.status(401).json({ error: 'Authentication failed', details: { err, info } });
      }

      req.logIn(user, { session: false }, (err) => {
        if (err) {
          console.error('Error during login:', err);
          return res.status(401).json({ error: 'Login failed', details: err });
        }
        console.log('Authentication successful for user:');
        next(user);
      });
    })(req, res, next);

export const master = () =>
    passport.authenticate(MASTER_STRATEGY_NAME, { session: false });

export const token = ({ required, roles = User.getAttributes().role.values } = {}) => (req, res, next) =>
    passport.authenticate(TOKEN_STRATEGY_NAME, { session: false }, (err, user, info) => {
      if (err || (required && !user) || (required && !roles.includes(user.role))) {
        return res.status(401).end();
      }
      req.logIn(user, { session: false }, (err) => {
        if (err) return res.status(401).end();
        console.log("In login")
        next(user);
      });
    })(req, res, next);

