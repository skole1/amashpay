const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
const passport = require('passport');

var dbconfig = require('../config/database');
var db = mysql.createConnection(dbconfig.connection);
db.query('USE ' + dbconfig.database);

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database:"amash_pay"

// });

// db.connect(()=>{
//     console.log(`Connected to database`);
// });


//Login Route
router.get('/login', (req, res)=>{
    res.render('users/login');
});

//Register Route
router.get('/register', (req, res)=>{
    res.render('users/register');
});

//Login Post
router.post('/login', (req, res, next)=> {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
});

//Register Form POST
router.post('/register', (req, res)=>{
    let errors = [];
    if(req.body.password != req.body.password2){
        errors.push({text:'Password do not match'});
    }

    if(req.body.password.length < 4){
        errors.push({text:'Password must be at least 4 character'});
    }

    if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email:req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    }else{
        let email = req.body.email;
        let sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, rows)=>{
            if(err){
                console.log(err)
            }
            if(rows.length){
                req.flash('error_msg','Email already Registered');
                res.redirect('/users/login')
            }else{
                const newUser = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                }
        
                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err){
                            console.log(err)
                        }
                        newUser.password = hash;
        
                        let sql = "INSERT INTO users SET ?";
                        db.query(sql, newUser, (err, rows)=>{
                            if(err){
                                console.log(err)
                            }else{
                                req.flash('success_msg','You are now registered and can login');
                                res.redirect('/users/login');
                            }
                        })
                    })
                })
            }
        })
    }
});

//Logout user
router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login');
})


module.exports = router;