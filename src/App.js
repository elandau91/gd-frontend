import React from 'react';
import './App.css';
import MainContainer from './Containers/MainContainer'
import { Route, Switch} from 'react-router-dom'

class App extends React.Component {
  


  
  render() {

    return (
      <>

        <Switch>
        
            <Route exact path="/" render={() => <MainContainer />}/>
         
        </Switch>
      </>
    );
  }


}

export default App;
