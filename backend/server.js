const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS Empresa (
      idEmpresa INTEGER PRIMARY KEY AUTOINCREMENT,
      nomeEmpresa TEXT,
      descricaoEmpresa TEXT
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS Area (
      idArea INTEGER PRIMARY KEY AUTOINCREMENT,
      nomeArea TEXT,
      descricaoArea TEXT,
      idEmpresa INTEGER,
      FOREIGN KEY (idEmpresa) REFERENCES Empresa(idEmpresa)
    )
  `);
});

/* TESTE */

app.get('/', function (req, res) {
    res.send("API rodando");
})

/* EMPRESAS */

app.post('/empresas', (req, res) => {
    const { nomeEmpresa, descricaoEmpresa } = req.body;
    const query = `INSERT INTO Empresa (nomeEmpresa, descricaoEmpresa) VALUES (?, ?)`;
    db.run(query, [nomeEmpresa, descricaoEmpresa], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao criar a empresa.');
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/empresas/:idEmpresa', (req, res) => {
    const { idEmpresa } = req.params;
    const { nomeEmpresa, descricaoEmpresa } = req.body;
    const query = `UPDATE Empresa SET nomeEmpresa = ?, descricaoEmpresa = ? WHERE idEmpresa = ?`;
    db.run(query, [nomeEmpresa, descricaoEmpresa, idEmpresa], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao atualizar a empresa.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Empresa não encontrada.');
        }
        res.sendStatus(204);
    });
});

app.get('/empresas', (req, res) => {
    const query = `SELECT * FROM Empresa`;
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao listar as empresas.');
        }
        res.json(rows);
    });
});

app.delete('/empresas/:idEmpresa', (req, res) => {
    const { idEmpresa } = req.params;
    const query = `DELETE FROM Empresa WHERE idEmpresa = ?`;
    db.run(query, [idEmpresa], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao excluir a empresa.');
        }
        if (this.changes === 0) {
            return res.status(404).send('Empresa não encontrada.');
        }
        res.sendStatus(204);
    });
});

/* AREAS */

app.get('/empresas/:idEmpresa/areas', (req, res) => {
    const { idEmpresa } = req.params;
    const query = `SELECT * FROM Area WHERE idEmpresa = ?`;
    db.all(query, [idEmpresa], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao listar as áreas da empresa.');
        }
        res.json(rows);
    });
});

app.post('/empresas/:idEmpresa/areas', (req, res) => {
    const { idEmpresa } = req.params;
    const { nomeArea, descricaoArea } = req.body;
    const query = `INSERT INTO Area (nomeArea, descricaoArea, idEmpresa) VALUES (?, ?, ?)`;
    db.run(query, [nomeArea, descricaoArea, idEmpresa], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao criar a área.');
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.delete('/empresas/:idEmpresa/areas', (req, res) => {
    const { idEmpresa } = req.params;
    const { nomeArea } = req.body;
    const query = `DELETE FROM Area WHERE idEmpresa = ? AND nomeArea = ?;`;
    db.run(query, [idEmpresa, nomeArea], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Erro ao criar a área.');
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
