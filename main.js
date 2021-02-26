const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const myConection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'usersdb',
  password: '12345'
});

app.get('/users', (req, res) => {
  myConection.query('SELECT * FROM users', (err, users) => {
    if (!err) {
      res.send(users);
    }
    else {
      res.status(500);
      res.send({ error: { message: err.message } });
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id);

  myConection.query("DELETE FROM users WHERE id=?", [id], (err, data) => {
    if (!err) {
      res.send({ message: 'ok' });
    }
    else {
      res.status(500);
      res.send({ error: { message: err.message } });
    }
  });
});

app.post('/users', (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }

  const firstName = req.body.firstName;
  const age = req.body.age;

  myConection.query('INSERT INTO users (firstName, age) VALUES(?, ?)', [firstName, age], (err, data) => {
    if (!err) {
      res.send({ message: 'ok' });
    }
    else {
      res.status(500);
      res.send({ error: { message: err.message } });
    }
  });
});

app.put('/users/:id', (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }

  const id = Number(req.params.id);
  const firstName = req.body.firstName;
  const age = req.body.age;

  myConection.query('UPDATE users SET firstName=?, age=? WHERE id=?', [firstName, age, id], (err, data) => {
    if (!err) {
      res.send({ message: 'ok' });
    }
    else {
      res.status(500);
      res.send({ error: { message: err.message } });
    }
  });
});

myConection.connect((err) => {
  if (!err) {
    console.log('Server connected');
    app.listen(8080, () => console.log('Server 8080'));
  }
  else
    console.log('Error');
});


