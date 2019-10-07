import * as express from 'express';
import * as path from 'path';
import { SERVER_PORT } from './config';
import { shuffle, duplicateElements } from './utils';
import { pagesRouter } from './routes/pages-router';
import { staticsRouter } from './routes/statics-router';
import * as socketio from 'socket.io';
import http = require('http');
import { cards } from './db';
import { Game } from './game';

const app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use(staticsRouter());
app.use(pagesRouter());

const server = http.createServer(app);
const cardsForGame = duplicateElements(cards);
const io = socketio(server);
let waitingPlayer = null;

io.on('connection', socket => {
  if (waitingPlayer) {
    new Game(waitingPlayer, socket, io);
    waitingPlayer = null;
  } else {
    waitingPlayer = socket;
    waitingPlayer.emit('message', 'Waiting for an opponent');
  }

  socket.on('initial_data', () => {
    io.sockets.emit('get_data', shuffle(cardsForGame));
  });
  socket.on('click', data => {
    io.sockets.emit('clicked', data);
  });
  socket.on('pairs', data => {
    io.sockets.emit('pairs', data);
  });
  socket.on('move', data => {
    const msg = `Player ${data.player} discovers the card ${data.cardName}`;
    io.sockets.emit('move', msg);
  });
});

server.listen(SERVER_PORT, () => {
  console.log(`App listening on port ${SERVER_PORT}!`);
});
