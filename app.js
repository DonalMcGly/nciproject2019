var express = require("express"); 
var app = express();
var mysql = require('mysql');
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var keyPublishable = 'pk_test_4DdFULH8jUoVC3YV0FcDvhxP009YMSHGEV'; 
var keySecret = 'sk_test_W2ixeFUrcmyBvitA9Kby0dFj00HYf7xs51'; 
var stripe = require("stripe")(keySecret);
var path = require('path');
var ejs = require('ejs');
app.set("view engine","ejs"); 
var fs = require('fs');
app.use(express.static("views"));
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(express.static("script"));
app.use(express.static("images"));
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));
var passport = require("passport"); 
var LocalStrategy = require('passport-local').Strategy;
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
app.use(cookieParser());
app.use(session({
	secret: 'supersecret',
	resave: true,
	saveUninitialized: true
})); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
///////////////////////////// CONNECTION TO MYSQL ///////////////////

db.connect((err) => {
    if(err){
    console.log("Uh oh MySQL Connection failed :(")
    }
    else
    {
    console.log("Connection to MySQL Database successful :)")    
    }
});
/////////////////////////// HOME PAGE //////////////
app.get("/", function(req, res){
    res.render("index");
    console.log("Home page")
    console.log('Cookies: ', req.cookies);
});
///////////////////////// ADMIN PAGE ///////////////
app.get('/admin',isAdmin,function(req,res){
res.render('admin')
console.log("Opening administrator page")
}); 
///////////////////////// CREATE ITEMS TABLE//////////
app.get('/createitem',isAdmin, function(req,res){
 let sql = 'CREATE TABLE item (id int NOT NULL AUTO_INCREMENT PRIMARY KEY,title varchar(255),brand varchar(255),image varchar(255),genre varchar(255),description varchar(255),quality varchar(255),price int(10));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  });
  res.send("Item Table Created,great")
});
////////////SEARCH FUNCTION /////////////////
app.post('/search', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%'+req.body.search+'%" or title LIKE "%'+req.body.search+'%" or genre LIKE "%'+req.body.search+'%" or price LIKE "%'+req.body.search+'%";'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('searched', {res1});
  });
 console.log("Search completed and results are displayed");
});
//////////////VIEW ALL PRODUCTS////////////////
app.get('/products',isAdmin,isLoggedIn,function(req, res){  
 let sql = 'SELECT * FROM item'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('products', {res1});
  });
  console.log("Now you are on the products page!");
});
/////////////////// VIEW XBOX ITEMS ////////////////////
app.get('/xbox', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%xbox%";'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('xbox', {res1});
  });
 console.log("Entering the Xbox page!");
});
app.get('/xbox-low', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%xbox%" ORDER BY price asc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('xbox', {res1});
  });
});
app.get('/xbox-high', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%xbox%" ORDER BY price desc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('xbox', {res1});
  });
});
/////////////////// VIEW PLAYSTATION ITEMS ////////////////////
app.get('/playstation', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%playstation%";'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('playstation', {res1});
  });
 console.log("Entering the Playstation page!");
});
app.get('/playstation-low', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%playstation%" ORDER BY price asc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('playstation', {res1});
  });
});

app.get('/playstation-high', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%playstation%" ORDER BY price desc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('playstation', {res1});
  });
});
/////////////////// VIEW NINTENDO SWITCH ITEMS ////////////////////
app.get('/switch', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%switch%";'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('switch', {res1});
  });
 console.log("Entering the Switch page!");
});
app.get('/switch-low', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%switch%" ORDER BY price asc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('switch', {res1});
  });
});
app.get('/switch-high', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%switch%" ORDER BY price desc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('switch', {res1});
  });
});
/////////////////// VIEW XBOX ITEMS ////////////////////
app.get('/retro', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%retro%";'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('retro', {res1});
  });
 console.log("Entering the Switch page!");
});
app.get('/retro-low', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%retro%" ORDER BY price asc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('retro', {res1});
  });
});
app.get('/retro-high', function(req, res){
 let sql = 'SELECT * FROM item WHERE brand LIKE "%retro%" ORDER BY price desc;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('retro', {res1});
  });
});
////////////////// EDIT A PRODUCT IN MYSQL ///////////////
app.get('/editsql/:id',isLoggedIn,isAdmin,function(req,res){
    let sql = 'SELECT * FROM item WHERE id = "'+req.params.id+'"'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('editsql',{res1});
    });
console.log("Edit item page!");
});
// Post url to edit products //
app.post('/editsql/:id',isLoggedIn,isAdmin,function(req,res){
let sql = 'UPDATE item SET title = "'+req.body.title+'",Price = '+req.body.price+',Genre = "'+req.body.genre+'",brand = "'+req.body.brand+'",Quality = "'+req.body.quality+'",Description = "'+req.body.description+'" WHERE id = "'+req.params.id+'"'
        let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        console.log("Oh dear,update failed")
    });
    res.redirect("/products");
});
///////////////////////// DELETE A PRODUCT ////////////////////
app.get('/deletesql/:id',isLoggedIn,function(req, res) {
    let sql = 'DELETE FROM item WHERE id = '+req.params.id+''
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    });
    res.redirect('/products'); 
});
//////////////////////// INSERT A NEW PRODUCT /////////////////
app.get('/newproduct',isLoggedIn,function(req,res){
res.render('newproduct', {user: req.user });
}); 
// Route to post / insert a new product //
app.post('/newproduct',function(req,res){
    let sampleFile = req.files.sampleFile
    var filename = sampleFile.name;
    sampleFile.mv('./images/'+ filename, function(err){
 });
let sql = 'INSERT INTO item (userid, title, brand, image,genre,description,quality,price) VALUES ("'+req.body.userid+'","'+req.body.title+'", "'+req.body.brand+'", "'+filename+'","'+req.body.genre+'","'+req.body.description+'","'+req.body.quality+'", '+req.body.price+')'
let query = db.query(sql,(err,res) =>{
if(err) throw err;
console.log("Oh dear,sql failed to input your data")
    });
    res.redirect("/");
});
////////////////////////// VIEW LOGGED IN USERS PRODUCTS /////////////////////////////////
app.get('/items/:userid',isLoggedIn,function(req,res){
    let sql = 'SELECT * FROM item WHERE userid LIKE "%'+req.params.userid+'%"'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('items',{res1,user: req.user });
    });
});
///////////////////////// CREATE USER TABLE //////////////////////////////////////
app.get('/createusertable',isAdmin, function(req,res){
 let sql = 'CREATE TABLE users (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, name varchar(255),username varchar(255), email varchar(255), password varchar(255));'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  });
  res.send("Users table has been created in the database")
});
//////////// LOGIN /////////////	
app.get('/login', function(req, res) {
	res.render('login', { message: req.flash('loginMessage') });
	console.log("You are on the log in page!");
});
app.get('/login2', function(req, res) {
	res.render('login2', { message: req.flash('loginMessage') });
});
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', 
    failureRedirect : '/login', 
    failureFlash : true 
}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
});
app.get('/adlogin', function(req, res) {
res.render('adlogin', { message: req.flash('loginMessage') });
	console.log("You are on the log in page!");
});
app.post('/adlogin', passport.authenticate('admin-login', {
    successRedirect : '/admin',
    failureRedirect : '/adlogin',
    failureFlash : true 
}),
    function(req, res) {
    if (req.body.remember) {
    req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
    req.session.cookie.expires = false;
    }
        res.redirect('/');
});
//////////// REGISTER /////////////	
app.get('/register', function(req, res) {
	res.render('register.ejs', { message: req.flash('signupMessage') });
	});
app.post('/register', passport.authenticate('local-signup', {
	successRedirect : '/profile', 
	failureRedirect : '/register',
	failureFlash : true 
	}));
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile', {
    user : req.user 
    });
});
//////////// LOG OUT /////////////	
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/signout');
});
app.get('/signout', function(req, res) {
    let sql = 'truncate table cart'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    });
    res.redirect('/'); 
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login2');
}
function isAdmin(req, res, next) {
	if (req.user.admin)
		return next();
	res.redirect('/');
}
////////////// PASSPORT SETUP //////////////////

passport.serializeUser(function(user, done) {
        done(null, user.Id); 
    });
passport.deserializeUser(function(Id, done) {
       db.query("SELECT * FROM user WHERE Id = ?",[Id], function(err, rows){
            done(err, rows[0]);
        });
    });
passport.use(
        'local-signup',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) {
            db.query("SELECT * FROM user WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    var newUserMysql = {
                        username: username,
                        email: req.body.email,
                        password: bcrypt.hashSync(password, null, null)  
                    };
                    var insertQuery = "INSERT INTO user ( username, email, password ) values (?,?,?)";
                    db.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                        newUserMysql.Id = rows.insertId;
                       return done(null, newUserMysql);
                    });
                }
            });
        })
    );
passport.use(
        'local-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) { 
            db.query("SELECT * FROM user WHERE username = ? AND admin = 0",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'The Username you entered cannot be found.')); 
                }
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'You entered the wrong password. Please try again'));
                return done(null, rows[0]);
            });
        })
    );
    passport.use(
        'admin-login',
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) { 
            db.query("SELECT * FROM user WHERE username = ? AND admin = 1",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'You must use the administrator account to log into this section.')); 
                }
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'You entered the wrong password. Please try again')); 
                return done(null, rows[0]);
            });
        })
    );
passport.serializeUser(function(user, done) {
done(null, user);
console.log("User Has Been Serialised " + user),
function(req){}
});
passport.deserializeUser(function(user_id, done) {
done(err,user_id);
});
////////////////////// VIEW ALL USERS ///////////////////////////////////////////
app.get('/viewusers',isLoggedIn,isAdmin, function(req, res){  
 let sql = 'SELECT * FROM user where admin = "0";'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('viewusers', {res1});
  });
 console.log("Entering page to view all Users!");
});
//////////////////////EDIT USER INFO ////////////////////////////////////////////
app.get('/editusersql/:id',isLoggedIn,isAdmin,function(req,res){
    let sql = 'SELECT * FROM user WHERE Id = "'+req.params.id+'"'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('editusersql',{res1});
    });
});
app.post('/editusersql/:id',function(req,res){
let sql = 'UPDATE user SET username = "'+req.body.username+'",email = "'+req.body.email+'" WHERE Id = "'+req.params.id+'"'
        let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        console.log("Oh dear,update failed")
    });
    res.redirect("/viewusers");
});
//////////////////////EDIT PROFILE INFO ////////////////////////////////////////////
app.get('/editprofile/:id',isLoggedIn,function(req,res){
    let sql = 'SELECT * FROM user WHERE Id = "'+req.params.id+'"'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('editprofile',{res1});
    });
});
app.post('/editprofile/:id',function(req,res){
let sql = 'UPDATE user SET name = "'+req.body.name+'",address = "'+req.body.address+'",email = "'+req.body.email+'" WHERE Id = "'+req.params.id+'"'
        let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        console.log("Oh dear,update failed")
    });
    res.redirect("/profile");
});

////////////////////// DELETE AN INDIVIDUAL USER ///////////////////////////////// 
app.get('/deleteuser/:id',isLoggedIn,isAdmin, function(req, res) {
    let sql = 'DELETE FROM user WHERE Id = '+req.params.id+''
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log("Oh dear,failed to delete this user")
    });
    res.redirect('/viewusers'); 
});
 
////////////////////////////////////////////////////////////
const url = require('url')
app.get('/contact', (req, res) => {
    console.log('Your on the contact us page now')
    res.render('contact')
})
app.post('/contact', (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var enquiry = req.body.enquiry
 
    var emailMessage = `\n\nFrom: ${name}<${email}>.\n\nMessage Enquiry: ${enquiry}\n.`
 
    console.log(emailMessage)
    res.redirect('/enquiry')
 
    var transporter = nodemailer.createTransport({
          service: 'gmail',
         auth: {
         user: 'consoletraderireland@gmail.com',
         pass: 'console2019'
        }
    })
    var mailOptions = {
        from: name,email,
        to: 'consoletraderireland@gmail.com',
        subject: 'Customer Enquiry',
        text: emailMessage
    }
transporter.sendMail(mailOptions, function (err, info) {
  if(err)
    console.log(err)
  else
    console.log(info);
})
})
app.get("/enquiry", function(req, res){
    res.render("enquiry");
});
///////////////////////////////// Cart Section ///////////////////////////
app.get('/createcart',isAdmin, function(req,res){
   var sql = "CREATE TABLE `cart` (cartid int NOT NULL AUTO_INCREMENT PRIMARY KEY,name varchar(20),cartprice int(20),quantity int(5) default '1' NOT NULL)"; 
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
  console.log(res);
  });
  res.send("Cart table created")
});
//////////////////////////////// VIEW CART/////////////////////////////////
app.get('/viewitem/:id',function(req,res){
    let sql = 'SELECT * FROM item WHERE id = "'+req.params.id+'"'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('viewitem',{res1, user: req.user });
    });
console.log("Page showing selected item!");
});
// Post url to edit products //
app.post('/cart/:id',isLoggedIn,function(req,res){
let sql = 'insert into cart (cartid,name,cartprice) SELECT id,title,price from item where id = "'+req.params.id+'" ON DUPLICATE KEY UPDATE quantity = quantity+1'
        let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        console.log(res1)
    });
    res.redirect("/yourcart");
});
///////////////////////////////////VIEW THE CART////////////////////////////////////////
app.get('/yourcart',isLoggedIn,function(req, res){  
 let sql = 'select *,(select Sum(cartprice*quantity)from cart) as Total from cart;'
  let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    console.log(res1);
    res.render('yourcart', {res1,user: req.user});
  });
});
///////////////////////////////////REMOVE AN ITEM FROM CART /////////////////////////////////
app.get('/rmcart/:id',isLoggedIn, function(req, res) {
    let sql = 'DELETE FROM cart WHERE cartid = '+req.params.id+''
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    });
    res.redirect('/yourcart'); 
});
//////////////////////////////// EMPTY THE CART /////////////////////////
app.get('/empty/',isLoggedIn, function(req, res) {
    let sql = 'truncate table cart'
    let query = db.query(sql, (err, res1) => {
    if(err) throw err;
    });
    res.redirect('/yourcart'); 
});
////////////////////////////////// PAYMENT PROCESS //////////////////////
app.get("/pay", ((req, res) => {
    res.render("pay",{keyPublishable: keyPublishable});
}));
app.post("/pay", function(req, res) {
    let amount = 10*100;
    stripe.customers.create({
        email: req.body.stripeEmail, 
        source: req.body.stripeToken 
    })
    .then(customer =>
        stripe.charges.create({ 
        amount,
        description: "Customer payment",
            currency: "eur",
            customer: customer.id
        }))
    .then(charge => res.render("pay")); 
});
/////////////////////////******** NEVER WRITE BELOW THIS LINE EVER EVER **********\\\\\\\\\\\\\\\\\\\\\\\\\
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0",function(){
console.log("Application Started!")
});
