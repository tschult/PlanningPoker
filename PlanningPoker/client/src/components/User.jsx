import React, { useContext } from 'react';
import { ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import { makeStyles } from '@material-ui/core/styles';
import { UserContext } from '../contexts/UserContext';
import useStyles from '../hooks/useStyles';


function User(props) {
    const classes = useStyles();
    const { user } = useContext(UserContext);
    const { player, isRunning } = props;

    return <ListItem key={player.id}>
        <ListItemAvatar>
            <Avatar className={player.selectedCard ? classes.green : ''}>
                {!isRunning
                    ? player.selectedCard === "Kaffee"
                        ? <FreeBreakfastIcon />
                        : player.selectedCard
                            ? <div>{player.selectedCard}</div>
                            : <LockOpenOutlinedIcon />
                    : player.selectedCard
                        ? <LockOutlinedIcon />
                        : <LockOpenOutlinedIcon />}
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={player.name === user ? "Ich" : player.name} />
    </ListItem>

};

export default User;