const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"amash_pay"

});

db.connect(()=>{
    console.log(`Connected to database`);
});


module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'email', passReqToCallback: true}, (req, email, password, done)=>{
        email = req.body.email;
        let sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], (err, rows) =>{
            if(err){
                return done(err);
            }

            if(!rows.length){
                return done(null, false, req.flash('error', 'No User Found'));
            }
            if(!bcrypt.compareSync(password, rows[0].password))
            return done(null, false, req.flash('error', 'Wrong password'));

            return done(null, rows[0]);
        })

    }))

    passport.serializeUser(function(user, done){
        done(null, user.id);
       });
      
       passport.deserializeUser(function(id, done){
        db.query("SELECT * FROM users WHERE id = ? ", [id],
         function(err, rows){
          done(err, rows[0]);
         });
       });
}