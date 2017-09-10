// Node Packages
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({entended: true}));

//Authentication
app.use(require("express-session")({
    secret: "This is a really interesting secret",
    resave: false,
    saveUninitialized: false,
}));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}
//Mongoose
mongoose.connect("mongodb://localhost/files");

var fileSchema =  new mongoose.Schema({
    name: String,
    URL: String,
    fileGroup: String
});

var File = mongoose.model("File", fileSchema);

// Routes
app.get("/", function(req, res) {
    res.render("index");
});

app.post("/", function(req, res){
    var name = req.body.name;
    var URL = req.body.URL;
    var fileGroup = req.body.fileGroup;
    var newFile = {name: name, URL: URL, fileGroup: fileGroup};
    File.create(newFile, function(err, createdFile){
        if(err){
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    sucessRedirect: "/upload",
    failureRedirect: "/login"
}) , function(req, res){
    res.redirect("/upload");
});

app.get("/upload", isLoggedIn, function(req, res){
    res.render("upload");
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/homework", function(req, res){
    res.render("homework");
});

app.get("classwork", function(req, res){
    res.render("classwork");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is up.");
}); 