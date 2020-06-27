const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const { ensureAuthenticated } = require('../helpers/auth')

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


//Idea Index page
router.get('/', ensureAuthenticated, (req, res)=>{
    let user = req.user.id;
    let sql = `SELECT * FROM idea WHERE user = ? ORDER by date DESC`;
    db.query(sql, [user], (err, results)=>{
        if(err){
            console.log(err);
        };
        res.render('ideas/index', {
            results: results
        });
    });
});

//About
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('ideas/add');
});

//Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{

    let id = req.params.id;
    let sql = "SELECT * FROM idea WHERE id = '" + id + "'";
    let query = db.query(sql, (err, result)=>{
        if(err){
            console.log(err);
        }
        if(result[0].user != req.user.id){
            req.flash('error_msg', 'Not Authorized')
            res.redirect('/ideas')
        }else{
            res.render('ideas/edit', {
            result: result[0]
            })
        }
    });
});

//Update
router.put('/:id', (req, res)=>{
    let id = req.params.id;
    let title = req.body.title;
    let details = req.body.details
    let sql = "UPDATE `idea` SET `title` = '" + title + "', `details` = '" + details + "'  WHERE `idea`.`id` = '" + id + "'";
    let query = db.query(sql, [title, details], (err, result)=>{
        if(err){
            return res.status(500).send(err)
        }
        req.flash('success_msg', 'Video idea Updated');
        res.redirect('/ideas');
    });
})


//Post Form
router.post('/', ensureAuthenticated, (req, res)=>{
   let errors = [];
   if(!req.body.title){
    errors.push({text:'Please add a title'});
   }

   if(!req.body.details){
    errors.push({text:'Please add some details'});
   }
if(errors.length > 0){
    res.render('ideas/add', {
        errors:errors,
        title:req.body.title,
        details:req.body.details
    });
}else{
    
    let post = {title:req.body.title, details:req.body.details, user: req.user.id}; 
    let sql = "INSERT INTO idea SET ?";
     db.query(sql, post, (err, result)=>{
         if(err){
             console.log(err);
         }else{
             console.log(result);
             req.flash('success_msg', 'Video idea added');
             res.redirect('/ideas');
         }
     })
}

});

//Update post
router.put('/:id', ensureAuthenticated, (req, res)=>{
    let title = req.body.title;
    let details = req.body.details;
    let sql = `update idea set title = 'title' and details = 'details' where id = ${req.params.id}`;
    db.query(sql, (err, result)=>{
        if(err){
            console.log(err);
        }else{
            req.flash('success_msg', 'Video idea Updated');
            res.redirect('/ideas')
        }
    })
});

//Delete process
router.delete('/:id', ensureAuthenticated, (req, res)=>{
    let id = req.params.id;
    let sql = "DELETE FROM idea WHERE id ='"+id+"'";
    db.query(sql, (err, result)=>{
        if(err) {
            console.log(err);
        }else{
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas')
        }
    })
});



module.exports = router;