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
app.get('/test', (req, res) => {
    res.render("test");
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
app.get('/alumini', function(req, res) {
    var noMatch = null;
    var arr=[];
    aluModel.find({}, function(err, allalumini){
    
    if(err){
       console.log(err);
    } else {   
        for(var i = 0; i < allalumini.length; i++){
            arr.push(allalumini[i].year);
        } 
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
          
          // usage example:
          
        var parr = arr.filter(onlyUnique);
        parr.sort(function(a, b){return b-a});
        res.render("alumini",{vagdevi_alumini:allalumini, noMatch: noMatch,parr});        
    }
    });
    
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





// Academics Schema
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


/*Loading Academics*/
app.get('/academics', (req, res) => {
    var noMatch = null;
    // store years and each section wrt year and ranks then populate 
    {
        const class_arr=[]
        const section_arr=[]
        
        acdModel.find({}, function(err, allacademics){
            for(let i=0;i<allacademics.length;i++){
                if(!class_arr.includes(allacademics[i].class)){
                    class_arr.push(allacademics[i].class)
                }
            }
            for(let i=0;i<allacademics.length;i++){
                if(!section_arr.includes(allacademics[i].section)){
                    section_arr.push(allacademics[i].section)
                }
            } 
        });
        acdModel.find({}, function(err, allacademics){
        if(err){
            console.log(err);
        } else {
          class_arr.sort()
          class_arr.reverse()
          section_arr.sort()
          res.render("academics",{vagdevi_academics:allacademics, noMatch: noMatch,class_arr,section_arr});
        }
        });

    }
});

/*adding Academics*/
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
/*deleting Academics*/
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




// Contact Schema
var conSchema = new mongoose.Schema({
    phno:String,
    studentname: String,
    class: String,
    enquiry:String
  },
  {
      collection : 'vagdevi_messages'
  });
var mesModel = mongoose.model("messages", conSchema);


/*Loading Contact*/
app.get('/messages', (req, res) => {
    var noMatch = null;

    {
        mesModel.find({}, function(err, allmessages){
           if(err){
               console.log(err);
           } else {
              res.render("messages",{vagdevi_messages:allmessages, noMatch: noMatch});
           }
        });
    }
});

/*adding Contact*/
app.post("/addmessages", (req, res) => {
    const saveMessages = new mesModel({
        phno:req.body.mob,
        studentname: req.body.name,
        class: req.body.class,
        enquiry:req.body.requ
    });
    saveMessages.save().then(
        () => {
            res.redirect("/");
        }
      ).catch(
        (error) => {
          res.render("contact");
          console.log(error);
        }
      );
})

// delete messages
app.post ('/deletemsg', function(req,res) {

    const deleteMess = mesModel.findOne({studentname: req.body.studentname},{class: req.body.class});
    deleteMess.remove().then(
        () => {
            res.redirect("/messages");
        }
      ).catch(
        (error) => {
          res.render(error);
        }
      );
    
})



app.listen(process.env.PORT || 5000, function (err) {
    if(err) {
        console.log(err);
    }
    else {
        console.log("Server started at 3000");
    }
})