const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');
const path = require('path');
const helmet = require('helmet'); // For security headers

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Enable security headers
app.use(helmet());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'chatapp',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('MySQL Connected');
});

app.use(express.static(path.join(__dirname, 'public')));

const activeUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    activeUsers[socket.id] = username;
    io.emit('userList', Object.values(activeUsers));
  });

  socket.on('message', (message) => {
    const sender = activeUsers[socket.id];
    db.query('INSERT INTO messages (sender, message) VALUES (?, ?)', [sender, message], (err, result) => {
      if (err) {
        console.error('Error saving message to the database:', err);
      } else {
        console.log('Message saved to the database');
      }
    });

    io.emit('message', { user: sender, message });
  });

  socket.on('disconnect', () => {
    delete activeUsers[socket.id];
    io.emit('userList', Object.values(activeUsers));
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
