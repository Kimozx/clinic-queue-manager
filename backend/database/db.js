const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, 'clinic.sqlite');

let SQL;
let db;

function normalizeParams(params = []) {
  return Array.isArray(params) ? params : Object.values(params);
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

async function initializeDatabase() {
  if (!SQL) {
    SQL = await initSqlJs();
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      dob TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      reason TEXT,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients(id)
    );
  `);

  const existingUser = getOne('SELECT id FROM users WHERE username = ?', ['staff']);

  if (!existingUser) {
    run(
      'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
      ['staff', 'password123', 'Clinic Staff']
    );
  }

  saveDb();
}

function run(sql, params = []) {
  const statement = db.prepare(sql);
  statement.bind(normalizeParams(params));
  statement.step();
  statement.free();

  const idResult = db.exec('SELECT last_insert_rowid() AS id');
  const insertedId = idResult[0] ? idResult[0].values[0][0] : null;

  saveDb();
  return { lastInsertRowId: insertedId };
}

function getAll(sql, params = []) {
  const statement = db.prepare(sql);
  statement.bind(normalizeParams(params));

  const rows = [];
  while (statement.step()) {
    rows.push(statement.getAsObject());
  }

  statement.free();
  return rows;
}

function getOne(sql, params = []) {
  const rows = getAll(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  initializeDatabase,
  run,
  getAll,
  getOne,
};
