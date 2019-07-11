const LocalStrategy = require('passport-local');
const Student = require('../models/student');

module.exports = (passport) => {

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, (email, password, done) => {

        //Match Student

        Student.findOne({
            email: email
        }).then(student => {
            if (!student)
                return done(null, false, {
                    message: 'That email is not registered'
                });

            // Match password

            Student.comparePassword(password, student.password, (err, isMatch) => {
                if (isMatch)
                    return done(null, student);
                else return done(null, false, {
                    message: 'Incorrect Password'
                });
            });
        }).catch(err => console.log(err));
    }));

    passport.serializeUser((student, done) => {
        done(null, student.id);
    });

    passport.deserializeUser((id, done) => {
        Student.getStudentById(id, (err, student) => {
            done(err, student);
        })
    });
}