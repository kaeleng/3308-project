/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();
const uuidv4 = require('uuid/v4');
const LocalStrategy = require('passport-local').Strategy;
// const pgp = new pgp({
//   user:process.env.PGUSER, 
//   host:process.env.PGHOST,
//   database:process.env.PGDATABASE,
//   password:process.env.PGPASSWORD,
//   port:process.env.PGPORT,
//   ssl:true
// });

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'project',
	user: 'postgres',
	password: 'hotdog'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory





app.get('/selection', function(req, res) {
  res.render('pages/selection.ejs',{
    my_title:"Learn Page"
  });
});




app.get('/learn', function(req, res) {
  res.render('pages/learn.ejs',{
    my_title:"Learn Page"
  });
});

app.get('/game', function(req, res) {
  res.render('pages/game.ejs',{
    my_title:"Learn Page"
  });
});



app.get('/login', function(req, res) {
  var query = 'select * from users';
  db.any(query)
      .then(function(rows) {
          res.render('pages/login.ejs',{
            my_title: "Login Page",
            data: rows
          })
      })
      .catch(function (err) {
            // display error message in case an error
            //request.flash('error', err);
      console.log("Not Working");
            res.render('pages/login.ejs', {
                my_title: 'Login Page',
                data: ''
            })
        })
});
 


app.get('/login/check', function(req, res) {
  var users_name = req.query.username;
  var users_password = req.query.password;
  var user_info =  "select username, password from users where username = '" + users_name + "' and password = '" + users_password+"';";
    // db.query("select * from users", function(err, result, fields) {
    //   console.log("Here");
    //   if (err) {
    //     throw err;
    //   }
    //   console.log(result)
    // });
  db.any(user_info)
      .then(function(rows) {
          res.render('pages/login.ejs',{
            my_title: "Login Page",
            data: rows

          })
      })
    .catch(function (err) {
            // display error message in case an error
            //request.flash('error', err);
      console.log("Not Working");
            res.render('pages/login.ejs', {
                my_title: 'Login Page',
                data: ''
            })
        })
});

// registration page 
app.get('/register', function(req, res) {
	res.render('pages/register',{
		my_title:"Registration Page",
    userData: req.user
	});
});

app.post('/register', function(req, res){
  var username = req.body.username;
  var pwd = req.body.password;
  var insert_statement = "INSERT INTO users(id, username, password) VALUES('" + uuidv4() + "','" + 
              username + "','" + pwd +"')";
    db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement)
        ]);
    })
    .catch(error => {
        // display error message in case an error
            request.flash('error', err);
            response.render('pages/register', {
                title: 'Home Page',
                userDate: ''
            })
          });
    res.redirect('/learn');
});

app.listen(3000);
console.log('3000 is the magic port');
