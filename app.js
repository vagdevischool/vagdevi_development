const express = require('express');
const { Result } = require('express-validator');
      passport = require('passport');
      mongoose = require('mongoose');
      alert = require('alert');
app=express();
      passport = require('passport');
      bodyParser = require('body-parser');
      LocalStrategy = require('passport-local');
      passportLocalMongoose = require('passport-local-mongoose');
      User =  require("./models/user");
// Connecting to database
mongoose.connect('mongodb://localhost/vagdevi');
      app.use(require("express-session") ({
          secret:"Any normal Word",//decode or encode session
          resave: false,          
          saveUninitialized:false   
      }));
var Schema = mongoose.Schema;
passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
      { extended:true }
))
app.use(passport.initialize());
app.use(passport.session());
app.use( express.static( "public" ) );
app.use(bodyParser.json());
var fs = require('fs');
var path = require('path');
require('dotenv/config');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

//connecting to DB

app.get('/', (req, res) => {
    res.render("index");
})

app.get('/about', (req, res) => {
    res.render("about");
})

app.get('/login', (req, res) => {
    res.render("login");
})


app.get('/contact', (req, res) => {
    res.render("contact");
})
app.get('/register', (req, res) => {
    res.render("register");
})

app.get('/addalumini', (req, res) => {
    res.render("addalumini");
})
app.get('/addevents', (req, res) => {
    res.render("addevents");
})

app.get('/addacademics', (req, res) => {
    res.render("addacademics");
})

app.get('/admin', (req, res) => {
    res.render("admin");
})

app.post("/login_authent", passport.authenticate("local", {
    successRedirect:"/admin",
    failureRedirect:"/login",
}),function(req, res) {
});


app.post("/register", (req, res) => {
    User.register(new User ({
        username: req.body.username,
        phone: req.body.phone,
        password:req.body.password,
    }),
    req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local") (req, res, function() {
            res.redirect("/login");
        })
    })
});


/*events schema*/
var ItemSchema = new mongoose.Schema({
    eventname: String,
    eventdate: String,
    studentname: String,
    description: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
  },
  {
      collection : 'vagdevi_events'
  });
var itemsModel = mongoose.model("items", ItemSchema);

/*adding data to events*/
app.post("/addevents", upload.single('image'), (req, res) => {
    const saveItem = new itemsModel({
        eventname: req.body.eventname,
        eventdate: req.body.date,
        studentname: req.body.studentname,
        description: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    saveItem.save().then(
        () => {
            res.redirect("/addevents");
        }
      ).catch(
        (error) => {
          res.render("addevents");
          console.log(error);
        }
      );
})

/* reading data from events*/
app.get('/events', (req, res) => {
    var noMatch = null;
    {
        itemsModel.find({}, function(err, allevents){
           if(err){
               console.log(err);
           } else {
              res.render("events",{vagdevi_events:allevents, noMatch: noMatch});
           }
        });
    }
});
/*delete events*/
app.post ('/deleteevents', function(req,res) {

    const deleteEvents = itemsModel.findOne({eventname: req.body.eventname1},{studentname: req.body.studentname1});
    deleteEvents.remove().then(
        () => {
            res.redirect("/addevents");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})
/*delete all events*/
app.post ('/deleteall_events', function(req,res) {

    itemsModel.deleteMany({}).then(
        () => {
            res.redirect("/addevents");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})


/*Alumini schema*/
var aluSchema = new mongoose.Schema({
    studentname: String,
    description: String,
    year:String,
    img:
    {
        data: Buffer,
        contentType: String
    },
  },
  {
      collection : 'vagdevi_alumini'
  });
var aluModel = mongoose.model("alumini", aluSchema);


/*Loading alumini*/
app.get('/alumini', (req, res) => {
    var noMatch = null;

    {
        aluModel.find({}, function(err, allalumini){
           if(err){
               console.log(err);
           } else {
              res.render("alumini",{vagdevi_alumini:allalumini, noMatch: noMatch});
           }
        });
    }
});

/*adding alumini*/
app.post("/addalumini", upload.single('image'), (req, res) => {
    const saveStudents = new aluModel({
        year:req.body.year,
        studentname: req.body.studentname,
        description: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    saveStudents.save().then(
        () => {
            res.redirect("/addalumini");
        }
      ).catch(
        (error) => {
          res.render("addalumini");
          console.log(error);
        }
      );
})
/*deleting alumini*/
app.post ('/deleteall_alumini', function(req,res) {

    aluModel.deleteMany({}).then(
        () => {
            res.redirect("/addalumini");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );   
})


app.post ('/deletestudent', function(req,res) {

    const deletestudent = aluModel.findOne({studentname: req.body.studentname1},{year : req.body.year1});
    deletestudent.remove().then(
        () => {
            res.redirect("/addalumini");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})






var acdSchema = new mongoose.Schema({
    class:String,
    section:String,
    studentname: String,
    rank:String,
    
    img:
    {
        data: Buffer,
        contentType: String
    },
  },
  {
      collection : 'vagdevi_academics'
  });
var acdModel = mongoose.model("academics", acdSchema);


/*Loading alumini*/
app.get('/academics', (req, res) => {
    var noMatch = null;

    {
        acdModel.find({}, function(err, allacademics){
           if(err){
               console.log(err);
           } else {
              res.render("academics",{vagdevi_academics:allacademics, noMatch: noMatch});
           }
        });
    }
});

/*adding alumini*/
app.post("/addacademics", upload.single('image'), (req, res) => {
    const saveStudents = new acdModel({
        class:req.body.class,
        section:req.body.section,
        studentname: req.body.studentname,
        rank: req.body.rank,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    saveStudents.save().then(
        () => {
            res.redirect("/addacademics");
        }
      ).catch(
        (error) => {
          res.render("addacademics");
          console.log(error);
        }
      );
})
/*deleting alumini*/
app.post ('/deleteall_academics', function(req,res) {

    acdModel.deleteMany({}).then(
        () => {
            res.redirect("/addacademics");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );   
})


app.post ('/deletestudent_academics', function(req,res) {

    const deletestudent = acdModel.findOne({studentname: req.body.studentname1},{class : req.body.class1},{section : req.body.section1});
    deletestudent.remove().then(
        () => {
            res.redirect("/addacademics");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})


app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function (err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Server started at 3000");
    }
})
