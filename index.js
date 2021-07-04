const express = require('express');
const app = express()
const PORT = 8080;

app.use(express.json());

const mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testdb"
  });

db.connect(err => {
    console.log("Connected!");
});

app.get('/', (req, res) => {
    res.status(200).send(JSON.stringify({"status": 200, "error": null, "response": "RestAPI is functional"}))
})

app.get('/users', (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
      if(err) throw err;
      res.status(200).send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
})

app.get('/users/:id', (req, res) => {
    const {id} = req.params;

    if(!id) {
        res.status(418).send(JSON.stringify({"status": 418, "error": "We need an ID", "response": null}))
    }
    else
    {
        db.query("SELECT * FROM users WHERE id=?", [id], (err, results) => {
            if(err) throw err;
            if(results != "")
                res.status(200).send(JSON.stringify({"status": 200, "error": null, "response": results}));
            else
                res.status(200).send(JSON.stringify({"status": 204, "error": null, "response": 'No User with that ID!'}));
          });
    }
})

app.post('/users/', (req, res) => {
    const { email, username, password } = req.body; 

    if(!email || !username || !password) {
        res.status(418).send(JSON.stringify({"status": 418, "error": "Please fill in the fields!", "response": null}))
    }
    else
    {
        db.query("SELECT * FROM users WHERE username=? OR email=?", [username, email], (err, results) => {
            if(err) throw err;
            if(results != "")
                res.status(200).send(JSON.stringify({"status": 200, "error": null, "response": "User Already registered!"}));
            else{
                db.query("INSERT INTO `users`(`email`, `password`, `username`) VALUES (?, ?, ?)", [email, password, username], (err, results) => {
                    res.status(200).send(JSON.stringify({"status": 200, "error": null, "response": "User Registered!"}));
                })
            }
        })
    }
});

app.listen(
    PORT,
    () => {
        console.log(`Listening on port ${PORT}`)
    },
);