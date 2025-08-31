require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { sequelize, User, Post } = require('./models');
const authRoutes = require('./routes/authRoutes');
const postRoutes =require('./routes/postRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new SequelizeStore({ db: sequelize });
app.use(session({
    secret: 'cheie-secreta-pentru-sesiuni-foarte-sigura',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());

app.use(async (req, res, next) => {
    if (req.session.userId) {
        try {
            res.locals.currentUser = await User.findByPk(req.session.userId, { attributes: ['id', 'username'] });
        } catch (error) {
            console.error(error);
            res.locals.currentUser = null;
        }
    } else {
        res.locals.currentUser = null;
    }
    
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    
    next();
});

app.use('/', authRoutes);
app.use('/', postRoutes);

app.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: { model: User, attributes: ['username'] },
            order: [['createdAt', 'DESC']]
        });
        res.render('index', { posts: posts });
    } catch (error) {
        console.error("Eroare la încărcarea postărilor:", error);
        res.status(500).send("Eroare la încărcarea postărilor.");
    }
});

app.listen(PORT, async () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
    await sequelize.sync();
    console.log('Baza de date sincronizată.');
});