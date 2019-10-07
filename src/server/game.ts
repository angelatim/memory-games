import { Socket, Server } from 'socket.io';

export class Game {
    public players: [Socket, Socket];
    public io: Server;
    public p1: Socket;
    public p2: Socket;
    constructor(p1: Socket, p2: Socket, io: Server) {
      this.players = [p1, p2];
      this.io = io;
      this.p1 = p1;
      this.p2 = p2;

      this.p1.emit('myTurn', true);
      this.p1.emit('message', 'Play');
      this.io.sockets.emit('player', 1);

      this.players.forEach((player, idx) => {
        player.emit('playerName', (idx + 1).toString());
        player.on('turn', () => {
          this._onTurn(idx);
        });
        player.on('finish', playerIdx => {
            this.io.sockets.emit('finish', true);
            this._sendToPlayer(playerIdx);
        });
      });
    }

    public _sendToPlayer(playerIndex) {
      this.players.forEach( (player, idx) => {
        if (idx + 1 !== playerIndex) {
            player.emit('message', `You lost! Player ${playerIndex} won`);
        } else {
            player.emit('message', `You won!`);
        }
      });
    }

    public _onTurn(playerIndex) {
      this.players.forEach((player, idx) => {
          if (idx === playerIndex) {
            player.emit('myTurn', false);
            player.emit('message', 'Wait for opponent!');
          } else {
            this.io.sockets.emit('player', idx + 1);
            player.emit('myTurn', true);
            player.emit('message', 'It\'s your turn!');
          }
      });
    }
  }
