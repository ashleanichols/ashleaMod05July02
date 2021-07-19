const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { String, Number, ObjectId } = Schema.Types;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [4, 'User name needs a minimun of 4 characters'],
        match: [/^[A-Za-z0-9]+$/, `User name should consists only letters and numbers`]
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password length should be at least 5 characters long!'],
        match: [/^[A-Za-z0-9]+$/, `Password should consists English latters and digits!`],
    },
    articles: [{
        type: ObjectId,
        ref: 'Article'
    }]

})

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { next(err); return }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return }
                this.password = hash;
                next();
            })
        });
        return;
    }
    next();
})

userSchema.methods = {
    matchPassword: function(password) {
        return bcrypt.compare(password, this.password);
    }
}

module.exports = new Model('User', userSchema);