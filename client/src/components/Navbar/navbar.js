import React, { useState, useEffect} from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import useStyles from './styles';
import memories from '../../images/memories.png';
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'

export default function Navbar() {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const classes = useStyles();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });

        history.push('/');

        setUser(null);
    };

    const signin = () => {
        history.push('/auth');
    }

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')));
      }, [location]);

    return (
        <AppBar className={classes.appBar} position="static" color="inherit">
            <div>
                <Typography component={Link} to='/' className={classes.heading} variant="h2" align="center">Memories</Typography>
                <img className={classes.image} src={memories} alt="icon" height="60" />
            </div>
            <Toolbar className={classes.toolbar}>
                {user ? (
                    <div className={classes.profile}>
                        <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>
                            {user.result.name.charAt(0)}
                        </Avatar>
                        <Typography className={classes.userName} variant='h6'>
                            {user.result.name}
                        </Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Log Out</Button>
                    </div>
                ) : (
                    <Button component={Link} to='/auth' variant='contained' className={classes.login } color='secondary' onClick={signin}>Sign In</Button>
                )}
            </Toolbar>
        </AppBar>
    )
}
