const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./todos.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )`);
    }
});

app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/todos', (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400).json({ error: 'Text field is required.' });
        return;
    }
    db.run('INSERT INTO todos (text) VALUES (?)', [text], function(err){
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.status(201).json({ id: this.lastID, text, completed: 0 });
    });
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    if (typeof completed !== 'number' || (completed !== 0 && completed !== 1)) {
        res.status(400).json({ error: 'Completed field must be 0 or 1.' });
        return;
    }
    db.run('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], function(err){
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found.' });
            return;
        }
        res.json({ message: 'Todo updated successfully.', id: Number(id), completed: completed });
    });
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM todos WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found. '});
            return;
        }
        res.json({ message: 'Todo deleted successfully.', id: Number(id) });
    });
});

app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
})