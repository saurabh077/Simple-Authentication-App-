var express                 =       require('express'),
    mongoose                =       require('mongoose'),
    passport                =       require('passport'),
    bodyParser              =       require('body-parser'),
    user                    =       require('./models/user');
    localStrategy           =       require('passport-local'),
    passportLocalMongoose   =       require('passport-local-mongoose');
mongoose.connect('mongodb://localhost/auth_demo_app'); 

var app = express(); 

app.use(require('express-session')({
    secret: 'Git hub is the best',
    resave :false,
    saveUninitialized: false
}));
passport.use(new localStrategy(user.authenticate()));
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine','ejs');

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.get('/',function(req,res){
    res.render('home');
});

app.get('/secret',isLoggedIn,function(req,res){
    res.render('secret');
});

app.get('/register',function(req,res){
    res.render('register');
});

app.post('/register',function(req,res){
    
    //res.send("You have entered the info succesfully");
    user.register(new user({username: req.body.username}), req.body.password,function(err,acc){
        if(err){
            console.log(err);             
            return res.render('register');
        }   
        passport.authenticate('local')(req,res,function(){
            res.render('secret');
        });
    });

});

app.get('/login',function(req,res){
    res.render('login');
});
//login logic
//middle ware works before final callback
app.post('/login',passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: 'login'
}),function(req,res){
    
});

app.get('/logout',function(req,res){
    req.logout(); //passport destroys the user data in that session
    res.redirect('/');
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.render('login');
}

var server = app.listen(3000,function(req,res){
    console.log('Server has started');
})
