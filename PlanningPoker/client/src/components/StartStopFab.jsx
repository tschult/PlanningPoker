import React from 'react';
import { Fab, Zoom } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import useStyles from '../hooks/useStyles';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';


const StartStopFab = (props) => {
    const { isRunning, onStart, onStop, startedBy } = props;
    const classes = useStyles();
    const { user } = useContext(UserContext);

    return <>
        <Zoom in={!isRunning}>
            <Fab className={classes.fab} color="primary" onClick={onStart}>
                <PlayArrowIcon />
            </Fab>
        </Zoom>
        <Zoom in={isRunning}>
            <Fab className={classes.fab} disabled={startedBy !== user} onClick={onStop}>
                <StopIcon />
            </Fab>
        </Zoom>
    </>
}


export default StartStopFab;