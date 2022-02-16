//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
require('dotenv').config()
const Class = require('./models/schedule.js')
const Merch = require('./models/merch.js')
const userController = require('./controllers/users_controller.js')
const session = require('express-session')
const sessionsController = require('./controllers/sessions_controller.js')
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3003;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

app.use('/users', userController)

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
)

app.use('/sessions', sessionsController)


//___________________
// Routes
//___________________

///////////////// Schedule Related Routes ///////////////////////

app.put('/schedule/:id', (req, res) => {
    Class.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
        res.redirect('/schedule')
    })
})

//delete Routes
app.delete('/schedule/:id', (req, res) => {
  Class.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect('/schedule')
  })
})

app.get('/schedule/:id/edit', (req, res) => {
  Class.findById(req.params.id, (err, foundClass) => {
    res.render(
      'edit.ejs',
      {
        course:foundClass,
        tabTitle: 'Edit',
        currentUser: req.session.currentUser
      })
  })
})

// Add new class page
app.get('/schedule/newClass', (req, res) => {
  res.render('new.ejs',{
    tabTitle:'Create',
    currentUser: req.session.currentUser
  }

)
})

//localhost:3000 - Home Page
app.get('/schedule' , (req, res) => {
  Class.find({}, (error, allClasses) => {
    res.render(
      'home.ejs', {
      classes: allClasses,
      tabTitle: 'Schedule',
      currentUser: req.session.currentUser
    });
  })
});

// show pages
app.get('/schedule/:id', (req,res) => {
  Class.findById(req.params.id, (err, foundClass) => {
    res.render(
      'show.ejs',{
    classes:foundClass,
    tabTitle: (req.params.className),
    currentUser: req.session.currentUser
    })
  })
})

// create new class
app.post('/schedule', (req, res) => {
  Class.create(req.body, (err, createdClass) => {
    res.redirect('/schedule')
  })
})

app.get('/' , (req, res) => {
    res.render(
      'index.ejs', {
      tabTitle: 'Home',
      currentUser: req.session.currentUser
    });
  })

//get route - static pricing page
  app.get('/pricing', (req, res) => {
    res.render('price.ejs', {
      tabTitle: 'Pricing',
      currentUser: req.session.currentUser
    })
  })

///////////////////// Merchandise related route ////////////////////
// get route merch page
  app.get('/merchandise', (req, res) => {
    res.render('merch.ejs', {
      tabTitle: 'Merchandise',
      currentUser: req.session.currentUser
    })
  })



  app.get('/cart', (req,res) => {
    Merch.find({}, (err,foundMerch) => {
      res.render('cart.ejs',{
        merchandise:foundMerch,
        tabTitle: 'Cart',
        currentUser: req.session.currentUser
      })
    })
    })


  // create new class
  app.post('/cart', (req, res) => {
    Merch.create(req.body, (err, createdClass) => {
      res.redirect('/cart')
    })
  })

  //delete Routes
  app.delete('/cart/:id', (req, res) => {
    Merch.findByIdAndRemove(req.params.id, (err, data) => {
      res.redirect('/cart')
    })
  })




//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
