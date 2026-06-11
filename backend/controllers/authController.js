const { getOne } = require('../database/db');

function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const user = getOne(
    'SELECT id, username, name FROM users WHERE username = ? AND password = ?',
    [username, password]
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = Buffer.from(`${user.id}:${user.username}`).toString('base64');

  return res.json({ token, user });
}

module.exports = {
  login,
};
