const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'list_app'
});


app.get('/', (_req, res) => {
    res.render('top.ejs');
})

app.get('/index', (_req, res) => {
    connection.query(
        'SELECT * FROM items',
        (_error, results) => {
            console.log(results);
            res.render('index.ejs', {items: results});
        }
    )
})

app.get('/new', (_req, res) => {
    res.render('new.ejs');
})

app.post('/create', (req, res) => {
    connection.query(
      'INSERT INTO items (name) VALUES (?)',
      [req.body.itemName],
      (_error, _results) => {
          res.redirect('/index');
      }
      )
});

app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM items WHERE id = ?',
        [ req.params.id ],
        (_error, _results) => {
          res.redirect('/index');
        }
    )
})

app.get('/edit/:id', (req, res) => {
    connection.query(
      'SELECT * FROM items WHERE id = ?',
      [req.params.id], 
      (_error, results) => {
        res.render('edit.ejs', {item: results[0]});
      }
      )
});

app.post('/update/:id', (req, res) => {
    connection.query(
      'UPDATE items SET name = ? WHERE id = ?',
      [req.body.itemName, req.params.id],
      (_error, _results) => {
        res.redirect('/index');
      }
      )
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});
