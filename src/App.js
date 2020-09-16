import React from 'react';
import './App.css';
import MainContainer from './Containers/MainContainer'
import LoginForm from './Components/LoginForm'
import SignupForm from './Components/SignupForm'
import NavigationBar from './Components/NavigationBar'

import { Route, Switch, withRouter} from 'react-router-dom'

class App extends React.Component {
  
  state = {
    currentUser: null
  }


  clearUser = () => {
    localStorage.removeItem("token")
    this.setState({currentUser: null}, () => this.props.history.push("/"))
  }

  loginHandler = (userInfo) => {
      
    let configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({user: userInfo})
    } 
    
    fetch('http://localhost:3000/api/v1/login', configObj)
        .then(response => response.json())
        .then(data => {
          if (data.error === "INVALID") {
            this.props.history.push("/")
            window.alert("Wrong Username or Password, please try again. :)")
          } else {
          localStorage.setItem("token", data.jwt)
          this.setState({currentUser: data.user}, ()=> this.props.history.push("/home"))
          }
    })
    
  }

  createHandler = (userInfo) => {
        
    let configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({user: userInfo})
    }   

    
    fetch('http://localhost:3000/api/v1/new', configObj)
      .then(response => response.json())
      .then(data => {
        if(data.error === 'failed to create user'){
            this.props.history.push("/createuser")
            window.alert("Username already exists, think outside the box.")
        } else {
        localStorage.setItem("token", data.jwt)
        this.setState({currentUser: data.user }, ()=> this.props.history.push("/home"))
        }
      })
}

  componentDidMount() {
    const token = localStorage.getItem("token")
    
    if (token) {
      fetch('http://localhost:3000/api/v1/profile', {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
      }).then(res => res.json())
        .then(user => {
          this.setState(
            {currentUser: user.user}
            )
        }
      )

    } else {
      this.props.history.push("/")
    }

  }

  
  render() {

    return (
      <>
        <NavigationBar clearUser={this.clearUser} currentUser={this.state.currentUser} />
        <Switch>
          {this.state.currentUser ? 
            <>
              <Route exact path="/home" render={() => <MainContainer />}/>
            </>
          :
            <>
              <Route exact path="/" render={() => <LoginForm loginHandler={this.loginHandler} /> } />
              <Route path="/createuser"  render={() => <SignupForm createHandler={this.createHandler}/> }/>  
            </>
          }
        </Switch>
      </>
    );
  }


}

export default withRouter(App);
