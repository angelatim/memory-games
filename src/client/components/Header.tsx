import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
let socket;

class Header extends React.Component {
  public state: any;
  constructor(props) {
    super(props);
    this.state = {
      endpoint: `http://localhost:3000/`
    };
    socket = socketIOClient(this.state.endpoint);
  }
public render() {
 return(
  <AppBar position='static' color='default'>
    <Toolbar>
      <Button color='primary' component={(p: any) => <Link to='/' {...p} />}>
        Home
      </Button>
      <Button
        color='primary'
        component={(p: any) => <Link to='/game' {...p} />}>
        Game
      </Button>
      <Button
        color='primary'
        component={(p: any) => <Link to='/about' {...p} />}
      >
        About
      </Button>
    </Toolbar>
  </AppBar>
);
 }
}

export { Header, socket };
