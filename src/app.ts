import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import path from 'path';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_db_name',
  password: 'your_db_password',
  port: 5432,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/register-owner', async (req, res) => {
  const { name, email, cpf, cnpj, companyName, pixKey, password } = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO owners (name, email, cpf, cnpj, company_name, pix_key, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [name, email, cpf, cnpj, companyName, pixKey, password]
    );
    client.release();
    res.send('Cadastro realizado com sucesso!');
  } catch (err) {
    console.error(err);
    res.send('Erro ao realizar cadastro.');
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM owners WHERE email = $1 AND password = $2',
      [email, password]
    );
    client.release();
    if (result.rows.length > 0) {
      res.redirect('/register-client');
    } else {
      res.send('Login falhou.');
    }
  } catch (err) {
    console.error(err);
    res.send('Erro ao realizar login.');
  }
});

app.get('/register-client', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registerClient.html'));
});

app.post('/register-client', async (req, res) => {
  const { name, email, cpf, cnpj, companyName, pixKey, password } = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO clients (name, email, cpf, cnpj, company_name, pix_key, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [name, email, cpf, cnpj, companyName, pixKey, password]
    );
    client.release();
    res.send('Cadastro de cliente realizado com sucesso!');
  } catch (err) {
    console.error(err);
    res.send('Erro ao realizar cadastro de cliente.');
  }
});

app.get('/register-user', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registerUser.html'));
});

app.post('/register-user', async (req, res) => {
  const { name, email, cpf, password } = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO users (name, email, cpf, password) VALUES ($1, $2, $3, $4)',
      [name, email, cpf, password]
    );
    client.release();
    res.send('Cadastro de usuário realizado com sucesso!');
  } catch (err) {
    console.error(err);
    res.send('Erro ao realizar cadastro de usuário.');
  }
});

app.get('/register-diarist', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registerDiarist.html'));
});

app.post('/register-diarist', async (req, res) => {
  const { name, phone, cpf, pixKey } = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      'INSERT INTO diarists (name, phone, cpf, pix_key) VALUES ($1, $2, $3, $4)',
      [name, phone, cpf, pixKey]
    );
    client.release();
    res.send('Cadastro de diarista realizado com sucesso!');
  } catch (err) {
    console.error(err);
    res.send('Erro ao realizar cadastro de diarista.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});