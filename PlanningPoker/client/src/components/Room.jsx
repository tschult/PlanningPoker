import { CircularProgress, Grid, Paper, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { ConnectionContext } from "../contexts/ConnectionContext";
import { UserContext } from "../contexts/UserContext";
import useStyles from "../hooks/useStyles";
import { Results } from "./Results";
import SelectCard from "./SelectCard";
import StartStopFab from "./StartStopFab";
import UserList from "./UserList";

const Room = () => {

    const classes = useStyles();

    const { signalRConnection } = useContext(ConnectionContext);

    const { user } = useContext(UserContext);

    const [roomState, setRoomState] = useState(null);

    const player = roomState?.players?.find((x) => { return x.name === user })
    const selectedCard = player?.selectedCard;

    const onReceiveGameState = (props) => {
        setRoomState({ ...props, players: Object.values(props.players) });
    };

    const onStartClick = () => {
        var allowedCards = ["1", "2", "3", "5", "8", "13", "Kaffee"];

        signalRConnection.invoke("StartRound", allowedCards).catch(function (err) {
            return console.error(err.toString());
        });
    };
    const onStopClick = () => {
        signalRConnection.invoke("EndRound");
    };

    const onSelectionChanged = (card) => {
        if (card === selectedCard) {
            card = null;
        }
        signalRConnection.invoke("SendCardSelection", card).catch(function (err) {
            return console.error(err.toString());
        });
    }

    useEffect(() => {
        if (signalRConnection) {
            signalRConnection.on("ReceiveGameState", onReceiveGameState);
        }
        return () => {
            if (signalRConnection) {
                signalRConnection.off("ReceiveGameState", onReceiveGameState);
            }
        }
    }, [signalRConnection]);

    console.log(roomState);

    const getRightSideComponent = () => {
        if (roomState.isRunning) {
            return <SelectCard availableCards={roomState.cards} onSelectionChanged={onSelectionChanged} selectedCard={selectedCard} />
        } else {
            if (roomState.lastResult.length) {
                return <Results results={roomState.lastResult} />
            }
        }
        return <Typography>Die erste Runde kann beginnen!</Typography>
    }

    if (!signalRConnection || !roomState)
        return <CircularProgress />
    return <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
            <Paper className={classes.paper}>
                <UserList players={roomState.players} isRunning={roomState.isRunning} />
            </Paper>
        </Grid>
        <Grid item xs={12} md={8} >
            <Paper className={classes.paper}>
                {getRightSideComponent()}
            </Paper>
        </Grid>
        <StartStopFab className={classes.fab} isRunning={roomState.isRunning} startedBy={roomState.startedBy} onStart={onStartClick} onStop={onStopClick} />

    </Grid>
}

export default Room;