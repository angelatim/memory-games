import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';

const css = require('./Home.css');
const logoImg = require('../../../assets/logo.png');

export class Home extends React.Component {
    public render() {
        return (
            <Grid item xs={12}>
                <Card>
                <CardHeader title='Multiplayer Game' />
                <CardContent>
                    <img src={logoImg} className={css.logo} />
                </CardContent>
                </Card>
            </Grid>
        );
    }
}