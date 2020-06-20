require('dotenv-safe').config();

const express = require('express');
const low = require('lowdb');
const bcrypt = require('bcryptjs');
const FileSync = require('lowdb/adapters/FileSync');
const status = require('http-status');
const jwt = require('jsonwebtoken');

const dbFile = process.env.NODE_ENV === 'test' ? 'db-test.json' : 'db.json';
const adapter = new FileSync(dbFile);
const db = low(adapter);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.get('users').find({ email }).value();
  if (!user) {
    return res.status(status.UNAUTHORIZED).send('WRONG_EMAIL_OR_PASSWORD');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(status.UNAUTHORIZED).send('WRONG_EMAIL_OR_PASSWORD');
  }
  return res.json({
    token: jwt.sign(
      // Note: in real app, we should use async API
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
    ),
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);

module.exports = app;
