import { List, ListSubheader, Typography } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import User from "./User";

const UserList = (props) => {
    const { players, isRunning } = props;
    const [sorted, setSorted] = useState([]);

    useEffect(() => {
        setSorted([...players].sort((a, b) => a.name.localeCompare(b.name)));
    }, [players]);

    return <List>
        <ListSubheader>
            <Typography>Angemeldete Benutzer</Typography>
        </ListSubheader>
        {sorted.map((u) => <User key={u.id} player={u} isRunning={isRunning} />)}
    </List>
}

export default UserList;