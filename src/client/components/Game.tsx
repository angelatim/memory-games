import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import * as React from 'react';
import { ICardDTO } from '../../shared/ICardDTO';
import { socket } from './Header';
const css = require('./Game.css');

interface IState {
  cardsToPlay: ICardDTO[];
  name: string;
  active: boolean[];
  click: number;
  visibleItem: number;
  myTurn: boolean;
  player: number;
  wrongTurn: boolean;
  cards: [number, number];
  match: number;
  text: string[];
  message: string;
  logs: boolean;
  finish: boolean;
  pairs;
}

export class Game extends React.Component<any, IState> {
  constructor(props) {
    super(props);
    this.state = {
      cardsToPlay: [],
      name: '1',
      active: [],
      click: 0,
      visibleItem: 0,
      myTurn: false,
      player: 0,
      wrongTurn: false,
      cards: null,
      match: 0,
      text: [],
      message: '',
      logs: false,
      finish : false,
      pairs: null
    };
  }

  public setVisible = (i: number) => {
    this.setState(() => ({visibleItem: i}));
  }

  public setClick = (i: number) => {
    this.setState(() => ({click: i}));
  }

  public game = (state, i) => {
    socket.emit('move', {player: state.player, cardName: state.cardsToPlay[i].cardName});
    if (state.click === 1) {
      this.setClick(0);
      const activeCards = state.active.map((item, j) => {
        if (j === i) {
          return !item;
        } else {
          return item;
        }
      });
      if (state.cardsToPlay[state.visibleItem].cardId !== state.cardsToPlay[i].cardId) {
        const switchPlayer = state.player === 1 ? 2 : 1;
        socket.emit('turn');
        this.setState(state => ({
          player: switchPlayer,
          wrongTurn: true,
          cards: [state.visibleItem, i]
        }));
      } else {
        const pairOfCards = state.match + 1;
        this.setState(() => ({ match: pairOfCards }));
        if (pairOfCards === this.state.pairs) {
          socket.emit('finish', state.player);
        } else {
          socket.emit('pairs', pairOfCards);
        }
      }
      socket.emit('click', activeCards);
      this.setVisible(null);
      return activeCards;
    } else {
      const activeCards = state.active.map((item, j) => {
        if (j === i) {
          this.setClick(state.click + 1);
          this.setVisible(i);
          return !item;
        } else {
          return item;
        }
      });
      socket.emit('click', activeCards );
      return activeCards;
    }
  }

  public onUpdateItem = i => {
    this.setState(state => ({ active: (this.game(state, i)), click: state.click + 1}));
  }

  public getActiveStatus = () => {
    socket.on('clicked', data => this.setState({active: data}));
    return this.state.active;
  }

  public showLogs = () => {
    this.setState(() => ({ logs: true}));
  }

  public newGame() {
    window.location.reload();
  }

  public render() {
    return (
      <>
        <Grid item xs={12}>
        <CardHeader title= {`Player ${this.state.name}`}/>
        <CardContent>
          {this.state.message}
        </CardContent>
        </Grid>
        <Grid item xs={2}>
          <CardContent>
            <div className={this.state.myTurn ? css.board : `${css.board} ${css.disabled}`} >
                {this.state.cardsToPlay.map((user, index) => {
                  return <div className={css.card} key={index}>
                    <img src={user.imageUrl}
                    className={this.state.active[index] ? css.visible : css.unflipped}
                    onClick={() => this.onUpdateItem(index)}
                    />
                  </div>;
                })}
              </div>
          </CardContent>
        </Grid>
        <Grid item xs={12}>
          <button onClick={this.newGame}>New Game</button>
          <button className= { this.state.finish ? '' : css.hidden } onClick={this.showLogs}>Look at the logs</button>
        </Grid>
        <Grid item xs={12}>
          <Card className= { this.state.logs ? '' : css.hidden }>
            <CardHeader title='Logs for the entire game' />
            <CardContent>
              <List>
                    {this.state.text.map((item, idx) => (<ListItem key={idx}>{item}</ListItem>))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </>
    );
  }

  public async componentDidMount() {
    socket.emit('initial_data');
    socket.on('get_data', data => this.setState({
      cardsToPlay: data,
      active: new Array(data.length).fill(false),
      pairs: data.length / 2 }));
    socket.on('clicked', (data: boolean[]) => this.setState({ active: data }));
    socket.on('player', (data: number) => this.setState({ player: data }));
    socket.on('pairs', (data: number) => this.setState({ match: data }));
    socket.on('myTurn', (data: boolean) => this.setState({ myTurn: data }));
    socket.on('playerName', (data: string) => this.setState({ name: data}));
    socket.on('message', data => this.setState({ message: data }));
    socket.on('finish', data => this.setState({ finish: data }));
    socket.on('move', (data: string) => {
      const logs = this.state.text;
      logs.push(data);
      this.setState({ text: logs }); });
  }

  public componentDidUpdate() {
    if (this.state.wrongTurn) {
      setTimeout(() => {
        const activeCards = this.state.active.map((item, idx) => {
          if (this.state.cards && (idx === this.state.cards[0] || idx === this.state.cards[1])) {
            return false;
          }
          return item;
        });
        socket.emit('click', activeCards);
        this.setState(() => ({
          active: activeCards,
          wrongTurn: false,
          cards: null}));
      }, 500);
    }
  }

  public componentWillUnmount() {
    socket.close();
  }
}
