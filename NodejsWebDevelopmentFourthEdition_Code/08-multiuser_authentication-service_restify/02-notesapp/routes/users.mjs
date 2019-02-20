import path            from 'path';
import util            from 'util';
import express         from 'express';
import passport        from 'passport';
import passportTwitter from 'passport-twitter';
import passportLocal   from 'passport-local';

import * as usersModel from '../models/users-superagent';
import { sessionCookieName } from '../app';

import DBG from 'debug';

const debug = DBG('notes:router-users');
const error = DBG('notes:error-users');


const TwitterStrategy = passportTwitter.Strategy;
const LocalStrategy   = passportLocal.Strategy;


export const router = express.Router();

/*
 * The initPassport function will be called from app.mjs, and it installs the
 * Passport middleware into the Express configuration.
 *
 * attaches data to the request object as req.user.
 */
export function initPassport(app)
{
  app.use( passport.initialize() );
  app.use( passport.session() );
}

/*
 * Will be used by other routing modules and is to be inserted into any
 * route definition that requires an authenticated logged-in user.
 *
 * For example, editing or deleting a note requires the user to be logged in
 */
export function ensureAuthenticated(req, res, next)
{
  try
  {
    // req.user is set by Passport in the deserialize function 
    if (req.user)
      next();
    else
      res.redirect('/users/login');
  }
  catch (e)
  {
    error(`ensureAuthenticated ERROR ${e.stack}`);

    next(e);
  }
}


router.get('/login', function(req, res, next)
{
  try
  {
    res.render('login', { 
      title: "Login to Notes", 
      user: req.user, 
    }); 
  }
  catch (e)
  {
    error(`/login ERROR ${e.stack}`);

    next(e);
  }
});

/*
 * If passport deems this a successful login attempt using LocalStrategy,
 * then the browser is redirected to the home page. Otherwise, it is
 * redirected to the /users/login page
 *
 */
router.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/',     // SUCCESS: Go to home page 
    failureRedirect: 'login', // FAIL: Go to /user/login 
  }) 
);

/*
 * Instructs Passport to erase their login credentials,
 * and they are then redirected to the home page.
 *
 * This function deviates from what's in the Passport documentation.
 * There, we are told to simply call req.logout. But calling only
 * that function sometimes results in the user not being logged out.
 * It's necessary to destroy the session object, and to clear the
 * cookie, in order to ensure that the user is logged out.
 *
 */
router.get('/logout', function(req, res, next)
{
  try
  {
    debug(`/logout`);

    req.logout();

    req.session.destroy();
    res.clearCookie(sessionCookieName);

    res.redirect('/'); 
  }
  catch (e)
  {
    error(`/logout ERROR ${e.stack}`);

    next(e);
  }
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/users/login' })
);


passport.use(new LocalStrategy( 
  async (username, password, done) =>
  {
    try
    {
      debug(`userPasswordCheck(${username}, ${password})`);

      /*
       * Performs the password check and then returns an object
       * indicating whether they're logged in or not.
       *
       */
      let check = await usersModel.userPasswordCheck(username, password);


      /*
       * we have two ways to tell Passport that the login attempt was unsuccessful.
       * - In one case, we use done(null, false) to indicate an error logging in, and pass
       *   along the error message we were given.
       * - In the other case, we'll have captured an exception, and pass along that exception.
       *
       */
      if (check.check)
      {
        debug(`userPasswordCheck shows good user ${util.inspect(check)}`);

        done(null, { id: check.username, username: check.username });
      }
      else
      {
        debug(`userPasswordCheck shows BAD user ${util.inspect(check)}`);

        done(null, false, check.message);
      } 
    }
    catch (e)
    {
      error(`userPasswordCheck shows ERROR ${e.stack}`);

      done(e);
    }
  } 
)); 

passport.use(
    new TwitterStrategy({
      consumerKey: "V5oBDLJOGsC7QztZlRqAk8sI4",
      consumerSecret: "0Vc1HHUEY3a4YYYfNJDFHPOiljruKMTiecHYyAufxN2Mc0Gxbm",
      callbackURL: "http://MacBook-Pro-4.local:3000/users/auth/twitter/callback"
    }
    , async function(token, tokenSecret, profile, done) {
      try
      {
        done(null, await usersModel.findOrCreate({
          id: profile.username, username: profile.username, password: "", provider: profile.provider, familyName: profile.displayName, givenName: "", middleName: "", photos: profile.photos, emails: profile.emails
        }));
      }
      catch(err) {
        done(err);
      }
  })
);


/*
 * The preceding functions take care of encoding and decoding authentication
 * data for the session. All we need to attach to the session is the username,
 * as we did in serializeUser. The deserializeUser object is called while processing
 * an incoming HTTP request and is where we look up the user profile data. Passport
 * will attach this to the request object.
 *
 */

passport.serializeUser(function(user, done)
{
  try
  {
    done(null, user.username); 
  }
  catch (e)
  {
    error(`serializeUser ERROR ${e.stack}`);

    done(e);
  }
}); 
 
passport.deserializeUser(async (username, done) =>
{
  try
  {
    var user = await usersModel.find(username);
    done(null, user);
  }
  catch(e)
  {
    error(`deserializeUser ERROR ${e.stack}`);

    done(e);
  }
}); 
