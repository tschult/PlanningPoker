import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    },
    paper: {
        padding: theme.spacing(2)
    },
    menuIcon: {
        marginRight: theme.spacing(4)
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
    },
    appBar: {
        flexGrow: 1
    },
    title: {
        flexGrow: 1
    },
    green: {
        color: '#fff',
        backgroundColor: theme.palette.primary.main,
    },
}));

export default useStyles;