import { Avatar, Button, GridList, GridListTile, Grow, Hidden, List, ListItem, ListItemIcon, ListSubheader, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    gridList: {
        justify: 'center',
        alignItems: 'stretch'
    },
    avatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        margin: theme.spacing(4)
    },
    selectedAvatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
        margin: theme.spacing(4),
        background: theme.palette.primary.main
    },
    selected: {
        background: theme.palette.primary.main
    }
}));

const SelectCard = (props) => {
    const { availableCards, onSelectionChanged, selectedCard } = props;
    const classes = useStyles();

    return <>
        <Hidden mdUp>
            <List>
                <ListSubheader><Typography>Wähle eine Karte</Typography></ListSubheader>
                {availableCards.map(card => (
                    <ListItem button key={card} onClick={() => onSelectionChanged(card)} selected={selectedCard === card}>
                        <ListItemIcon>
                            <Avatar className={selectedCard === card ? classes.selected : ""}>
                                {card === "Kaffee" ? <FreeBreakfastIcon /> : <Typography >{card}</Typography>}
                            </Avatar>
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>
        </Hidden>
        <Hidden smDown>
            <div className={classes.root}>
                <GridList cellHeight={160} cols={3} className={classes.gridList} spacing={2}>
                    {availableCards.map(card => (
                        <Grow in={true} key={card}>
                            <GridListTile  >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => onSelectionChanged(card)}
                                    color={selectedCard === card ? "primary" : "default"} >
                                    <Avatar className={selectedCard === card ? classes.selectedAvatar : classes.avatar} >
                                        {card === "Kaffee" ? <FreeBreakfastIcon /> : <Typography variant="h4" >{card}</Typography>}
                                    </Avatar>

                                </Button>

                            </GridListTile>
                        </Grow>
                    ))}

                </GridList>
            </div>
        </Hidden>
    </>
}

export default SelectCard;