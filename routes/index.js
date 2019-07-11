const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');

const Student = require('../models/student');
const passport = require('passport');


router.get('/', ensureAuthenticated, (req, res) => {
    const {
        name,
        surname,
        age,
        degree,
        favouriteCourse,
        email
    } = req.user;
    res.render('dashboard', {
        page: 'save',
        title: 'Dashboard',
        student: {
            name,
            surname,
            age,
            degree,
            favouriteCourse,
            email
        }
    });
});

// Register Page

router.get('/student/register', (req, res) => {
    res.render('register', {
        page: 'register',
        title: 'Register'
    });
});
// Login Page
router.get('/student/login', (req, res) => {
    res.render('index', {
        page: 'login',
        title: 'Sign in'
    });
});

// Logout Handle
router.get('/student/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have successfuly logged out');
    res.redirect('/student/login');
});

// Save changes Handle

router.post('/student/save', ensureAuthenticated, (req, res) => {

    const {
        name,
        surname,
        age,
        degree,
        favourite_course
    } = req.body;

    const student = req.user;

    student.name = name;
    student.surname = surname;
    student.age = parseInt(age);
    student.degree = degree;
    student.favouriteCourse = favourite_course;

    student.save((err, _student) => {
        if (err) {
            req.flash('error_msg', "Unable to save changes!");
            res.redirect('/');
        }
        if (_student) {
            req.flash('success_msg', "Changes saved.");
            res.redirect('/');
        }
    });

});

// Login Handle
router.post('/student/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/student/login',
        failureFlash: true
    })(req, res, next);
});

// Register Handle
router.post('/student/register', (req, res) => {

    const {
        name,
        surname,
        age,
        degree,
        favourite_course,
        email,
        password,
        confirm_password
    } = req.body;

    let errors = [];

    // Check passwords match

    if (password !== confirm_password) errors.push({
        msg: "Passwords do not match!"
    });

    if (password && password.length < 6) errors.push({
        msg: 'Password should be at least 6 characters long'
    });

    if (errors.length > 0) {
        res.render('register', {
            errors,
            page: 'register',
            title: 'Register',
            name,
            surname,
            age,
            degree,
            favourite_course,
            email,
            password,
            confirm_password
        });

    } else {
        // Validation passed

        Student.findOne({
            email: email
        }).then(student => {
            if (student) {
                // Student exist
                errors.push({
                    msg: 'Email is already in use.'
                });
                res.render('register', {
                    errors,
                    page: 'register',
                    title: 'Register',
                    name,
                    surname,
                    age,
                    degree,
                    favourite_course,
                    email,
                    password,
                    confirm_password
                });
            } else {

                const newStudent = new Student({
                    name,
                    surname,
                    email,
                    age: parseInt(age),
                    degree,
                    favouriteCourse: favourite_course,
                    password
                });

                Student.createStudent(newStudent, (err, student) => {
                    if (err)
                        console.log(err);

                    if (student) {
                        req.flash('success_msg', "You are now registered and may now login");
                        res.redirect('/student/login');
                    }
                });

            }
        });
    }
});

module.exports = router;