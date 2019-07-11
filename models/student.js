const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Create Schema and model

const StudentSchema = new Schema({
    name: String,
    surname: String,
    email: {
        type: String,
        required: true
    },
    age: Number,
    degree: String,
    favouriteCourse: String,
    password: {
        type: String,
        required: true
    }
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
module.exports.createStudent = (newStudent, callback) => {
    console.log(newStudent);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newStudent.password, salt, (err, hash) => {
            if (err) throw err;

            //Set password to hashed password
            newStudent.password = hash;
            newStudent.save(callback);
        });
    });

}

module.exports.getStudentByEmail = (email, callback) => {
    Student.findOne({
        email: email
    }, callback);
}

module.exports.getStudentById = (id, callback) => {
    Student.findById(id, callback);
};

module.exports.comparePassword = (password, hash, callback) => {

    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}