import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import login from './pages/login';
import signup from './pages/signup';
import home from './pages/home'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';


// const App = () => <h1>{process.env.API_URL}</h1>;

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#33c9dc',
			main: '#6d59ff',
			dark: '#d50000',
			contrastText: '#fff'
    }
  }
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={home}/>
          <Route exact path="/login" component={login}/>
          <Route exact path="/signup" component={signup}/>
        </Switch>
      </div>
    </Router> 
    </MuiThemeProvider>
  );
}

export default App;