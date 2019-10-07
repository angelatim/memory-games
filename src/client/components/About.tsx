import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

export class About extends React.Component {

  public render() {
    return (
    <Card>
      <CardHeader title='Created by Angela Timofte.' />
      <CardContent>
        <Typography>
         How to play online memory 2 player: 
        </Typography>
        <Typography>
          You can play with a friend, the game tells you when it's your turn to play.
        </Typography>
        <Typography>
          The purpose of the game is to reconstruct the pairs of cards by turning them 2 by 2.
          If the cards turned face up are the same (a pair) you win and you can replay, otherwise your
          turn ends (the cards are automatically turned face down) and the turn moves to the next player.
          When the players have found all the pairs, the game ends!
        </Typography>
        <Typography>
          Every time you start a new game, a random selection of the cards ensures a different game, so you
          can replay endlessly.
        </Typography>
      </CardContent>
    </Card>);
  }
}
