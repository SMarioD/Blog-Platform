const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.showRegisterPage = (req, res) => {
    res.render('auth/register', { error: null });
};
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.render('auth/register', { error: 'Acest nume de utilizator este deja folosit.' });
        }
        await User.create({ username, password });
        
        req.flash('success_msg', 'Cont creat cu succes! Acum te poți autentifica.');
        res.redirect('/login');
    } catch (error) {
        console.error("Eroare la înregistrare:", error);
        res.status(500).send('A apărut o eroare la înregistrare.');
    }
};

exports.showLoginPage = (req, res) => {
    res.render('auth/login', { error: null });
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.render('auth/login', { error: 'Nume de utilizator sau parolă incorectă.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth/login', { error: 'Nume de utilizator sau parolă incorectă.' });
        }

        req.flash('success_msg', 'Te-ai autentificat cu succes!');
        req.session.userId = user.id;
        req.session.save(() => {
            res.redirect('/');
        });

    } catch (error) {
        console.error("Eroare la login:", error);
        res.render('auth/login', { error: 'A apărut o eroare la autentificare.' });
    }
};
exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }

        req.flash('success_msg', 'Te-ai delogat cu succes.');
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};