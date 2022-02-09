import { Avatar, Grid, LinearProgress, Typography } from "@material-ui/core";
import React from "react";
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import { useState } from "react";
import { useEffect } from "react";
import useStyles from "../hooks/useStyles";

export function Results(props) {
    const { results } = props;
    const classes = useStyles();

    const [weightedResults, setWeightedResults] = useState([]);
    useEffect(() => {
        var total = 0;
        results.map(result => { total = total + result.count });
        var weighted = [];

        results.forEach(result => {
            weighted.push({ ...result, percentage: (result.count / total) * 100 });
        });

        setWeightedResults(weighted);
    }, [results]);


    console.log(results);
    return <>
        <Typography>Ergebnis</Typography>
        <Grid container justify="center" alignItems="center" spacing={4}>
            {weightedResults.map(result => (
                <>
                    <Grid item xs={1} >
                        <Avatar className={classes.green}>
                            {result.card === "Kaffee" ? <FreeBreakfastIcon /> : <div >{result.card}</div>}
                        </Avatar>

                    </Grid>
                    <Grid item xs={11}>
                        <LinearProgress variant="determinate" value={result.percentage} />
                    </Grid>
                </>
            ))}
        </Grid></>
}
