const express = require('express');
const path = require('path');
const mysql = require('mysql');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const exphbs  = require('express-handlebars');


const app = express();

//Load routes
const ideas = require('./routes/index');
const users = require('./routes/users');

app.engine('handlebars', exphbs({
    defaultLayout:'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  }));

  //Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());

  //Global variable
  app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });

const port = process.env.PORT || 5000;

//Index Route
app.get('/', (req, res)=>{
    const title = 'Home!';
    res.render('index',{title});
});

//About
app.get('/about', (req, res)=>{
    res.render('about');
});


//Load ideas route
app.use('/ideas', ideas);
app.use('/users', users);

require('./config/passport')(passport);

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});