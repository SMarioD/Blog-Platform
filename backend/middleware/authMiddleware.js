const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    
    req.flash('error_msg', 'Trebuie să fii autentificat pentru a accesa această pagină.');
    res.redirect('/login');
};

module.exports = isAuthenticated;