const bcrypt = require('bcrypt');
const pool = require('../db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    }); // if you are using sessions

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use('local', new LocalStrategy({ passReqToCallback: true },
        async (req, email, password, done) => {
            loginAttempt();
            async function loginAttempt() {
                try {
                    const result = await pool.query('SELECT admin_id,hash_pass FROM admins WHERE email=$(1)', [email]);
                    if (result.rows[0] == null) {
                        return done(null, false, { message: "User does not exist" });
                    } else {
                        bcrypt.compare(password, result.rows[0].hash_pass, (err, check) => {
                            if (err) {
                                console.log(err);
                                return done(null, false, { message: "An error occured" });
                            } else if (check && result.rows[0].authorized) {
                                return done(null, [{ email: result.rows[0].email, authorized: result.rows[0].authorized }])
                            } else {
                                return done(null, false, { message: "An error occured" })
                            }
                        })
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }));
}