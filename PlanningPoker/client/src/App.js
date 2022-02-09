import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import { CssBaseline, Grid, ThemeProvider, Container, AppBar, Toolbar, Typography, IconButton, useMediaQuery, Drawer, Divider } from '@material-ui/core';
import Login from './components/Login';
import * as signalR from '@aspnet/signalr';
import { createMuiTheme } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';
import { UserContext } from './contexts/UserContext';
import { ConnectionContext } from './contexts/ConnectionContext';
import StyleIcon from '@material-ui/icons/Style';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChatIcon from '@material-ui/icons/Chat';
import InstallPWAButton from './components/InstallPWAButton';
import { deDE } from '@material-ui/core/locale';
import MessageBoard from './components/MessageBoard';
import Room from './components/Room';
import useStyles from './hooks/useStyles';


function App() {


  const classes = useStyles();

  const [user, setUser] = useState('');
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  const [signalRConnection, setSignalRConnection] = useState(null);
  const connectionValue = useMemo(() => ({ signalRConnection, setSignalRConnection }), [signalRConnection, setSignalRConnection]);

  var [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [useDarkMode, setUseDarkMode] = useState(useMediaQuery('(prefers-color-scheme: dark)'));
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: useDarkMode ? 'dark' : 'light',
          primary: teal,
          secondary: teal,
        }
      }, deDE), [useDarkMode]);

  const onLoginClick = async () => {
    if (!user) return;
    setIsLoggedIn(true);
    try {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("/pokerHub")
        .build();
      connection.onclose(async () => {
        await start(connection);
      })
      await start(connection);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  async function start(connection) {
    try {
      await connection.start();
      setSignalRConnection(connection);
      connection.invoke("Enter", user);
    } catch (err) {
      setTimeout(() => start(connection), 5000);
    }
  }

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={userValue}>
        <ConnectionContext.Provider value={connectionValue}>
          <div className={classes.appBar}>
            <AppBar position="fixed">
              <Toolbar >
                <StyleIcon className={classes.menuIcon} />
                <Typography variant="h6" className={classes.title}>Planning Poker</Typography>
                <IconButton color="inherit" onClick={() => setUseDarkMode(!useDarkMode)}>
                  {useDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                <InstallPWAButton />
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerOpen}
                  className={clsx(isDrawerOpen && classes.hide)}
                >
                  <ChatIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Toolbar />
          </div>
          <div className={classes.root}>
            <Container>
              {!isLoggedIn &&
                <Grid container justify="center" alignItems="center" spacing={4}>
                  <Grid item xs={12} md={6} lg={4} >
                    <Login onLoginClick={onLoginClick} />
                  </Grid>
                </Grid>
              }
              {isLoggedIn &&                
                  <Room />
              }
            </Container>
          </div>
          {isLoggedIn && signalRConnection && <Drawer variant="persistent" open={isDrawerOpen} anchor="right" >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <MessageBoard signalRConnection={signalRConnection} user={user} />
            <Divider />

          </Drawer>}
        </ConnectionContext.Provider>
      </UserContext.Provider>
    </ThemeProvider>

  );
}

export default App;
