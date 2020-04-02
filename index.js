const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const Admin = require('./models/Admin');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Auth = require('./auth/Auth');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60 * 60 * 1000 }}));
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
app.post('/news', async (req, res) => {
    try {
        const { news_title, news_body, email } = await req.body;
        console.log(news);
        console.log(email);
        const { error, value } = await User.validate({ news_title: news_title, news_body: news_body, email: email });
        console.log("HIT");
        if (error === undefined) {
            const status = await pool.query("INSERT INTO news(news_title,news_body,email,news_status) VALUES ($1,$2,$3,'pending') RETURNING *", [news_title, news_body, email]);
            return res.json(status.rows[0]);
        } else {
            console.log(error + " else");
            return res.json(error);
        }
    } catch (error) {
        res.status(401).json(error);
        console.error(error.message + " catch");
    }
})
app.get('/news', async (req, res) => {
    try {
        console.log("GETTING LATEST NEWS");
        const news = await pool.query('SELECT * FROM news');
        console.log("GOT LATEST NEWS");
        return res.json(news.rows);
    } catch (err) {
        console.error(err.message);
    }
})
app.post('/admin/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return null;
            } else {
                console.log(hash);
                const { error } = Admin.validate({ email, hash });
                console.log(error);
                if (!error) {
                    const check = await pool.query('SELECT * FROM admins WHERE email=$1', [email]);
                    if (!check.rows[0]) {
                        await pool.query("INSERT INTO admins(email,hash_pass,authorized) VALUES ($1,$2,false)", [email, hash]);
                        return res.json({ 'message': 'Account Created' })
                    } else {
                        return res.status(409).json({ 'message': 'User already exists' });
                    }
                } else {
                    return res.status(400).json({ 'message': 'An error occured' });
                }
            }

        });


    } catch (e) {
        console.log(e);
        res.send('Internal Server Error').status(500);
    }
})
app.put("/admin/authenticate", (req, res) => {
    try {
        const { email } = req.body;

    } catch (err) {
        console.log(err);
    }
})
app.get("/", (req, res) => {
    pool.query('SELECT * FROM admins;').then((value) => { console.log(value.rows[0]); });
    return res.send("Hello");
})
app.listen(process.env.PORT || 8000, () => {
    console.log("RUNNING");
})