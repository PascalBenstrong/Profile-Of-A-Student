module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        console.log(req.isAuthenticated());
        req.flash('error_msg', 'Please login to view this resource');
        res.redirect('/student/login');
    }
}