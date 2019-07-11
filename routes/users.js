/*

const express = require('express');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');

const Student = require('../models/student');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const {
    ensureAuthenticated
} = require('../config/auth');


// Register

router.get('/register', (req, res) => {
    res.render('register');
});


// Login
router.get('/login', (req, res) => {
    res.render('login');
});

//Login Student

// Login

passport.use(new localStrategy((email, password, done) => {

    Student.getUserByEmail(email, (err, student) => {
        if (err) throw err;
        if (!student) return done(null, false, {
            message: 'Unknown Student'
        });

        Student.comparePassword(password, student.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) return done(null, student);
            else return done(null, false, {
                message: 'Invalid password'
            });
        });

    });

}));

passport.serializeUser((student, done) => {
    done(null, student.id);
});

passport.deserializeUser((id, done) => {
    Student.getStudentById(id, (err, student) => {
        done(err, student);
    });
});

router.post('/login', passport.authenticate('local', {
    usernameField: 'email',
    passwordField: 'password',
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res) => {

    res.redirect('/');
});

//Register Student

router.post('/register', [check('password', 'Password must be at least 6 character long').isLength({
    min: 6
}).custom((value, {
    req,
    loc,
    path
}) => {
    if (value !== req.body.confirm_password)
        // Throw a new error
        throw new Error('Passwords do not match');

    return value;
})], (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    const age = req.body.age;
    const degree = req.body.degree;
    const favouriteCourse = req.body.favourite_course;
    const password = req.body.password;

    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newStudent = new Student({
            name: name,
            surname: surname,
            email: email,
            age: parseInt(age, 10),
            degree: degree,
            favouriteCourse: favouriteCourse,
            password: password
        });

        Student.createStudent(newStudent, (err, student) => {
            if (err)
                throw err;
        });
        req.flash('success_msg', 'You are now registered and may now login')
        res.redirect('/');
    }

});

//Logout

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/users/login');
});

module.exports = router;

*/