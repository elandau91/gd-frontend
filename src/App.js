import React from 'react';
import './App.css';
import MainContainer from './Containers/MainContainer'
import LoginForm from './Components/LoginForm'
import SignupForm from './Components/SignupForm'
import NavigationBar from './Components/NavigationBar'
import Profile from './Components/Profile'

import { Route, Switch, withRouter} from 'react-router-dom'
import ShowShow from './Components/ShowShow';

class App extends React.Component {
  
  state = {
    currentUser: null,
    currentShow: null
  }


  clearUser = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("show")
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
          this.setState({currentUser: data.user}, ()=> this.props.history.push("/shows"))
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
        this.setState({currentUser: data.user }, ()=> this.props.history.push("/shows"))
        }
      })
}

  componentDidMount() {
    const token = localStorage.getItem("token")
    const showString = localStorage.getItem("show")
    const show = JSON.parse(showString)
    
    if (token) {
      fetch('http://localhost:3000/api/v1/profile', {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
      }).then(res => res.json())
        .then(user => {
          this.setState(
            {currentUser: user.user,
             currentShow: show
            }
            )
        }
      )

    } else {
      this.props.history.push("/")
    }

  }

  renderShow = (showObj) => {
    localStorage.setItem("show", JSON.stringify(showObj))
    console.log(showObj)
    this.setState({
      currentShow: showObj
    })
  }

  confirmDelete = () => {

    const options = {
      method: "DELETE"
    }

    fetch(`http://localhost:3000/api/v1/users/${this.state.currentUser.id}`, options)
    .then(res => {
      localStorage.removeItem("token")
      localStorage.removeItem("show")
      this.setState({
        currentUser: null,
        currentShow: null
      }, () => {
        this.props.history.push("/")
        window.alert("Account Deleted, Bye!")})
    })

  }

  confirmUpdates = ({username, email, avatar}) => {

    const options = {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        avatar: avatar
      })
    }

    fetch(`http://localhost:3000/api/v1/users/${this.state.currentUser.id}`, options)
    .then(res => res.json())
    .then(updatedUser => {
      if(updatedUser.error === 'failed to update user') {
        window.alert("Username already exists, think outside the box.")
      } else {
        this.setState({...this.state, currentUser: updatedUser}) 
      }
    })

  }

  postFavorite = (showUuid) => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        user_id: this.state.currentUser.id,
        show_id: showUuid
      })
    }

    fetch('http://localhost:3000/api/v1/fave_shows', options)
    .then(res => res.json())
    .then(
      newFave => {
      let newProps = this.state.currentUser
      newProps.shows = [...this.state.currentUser.shows, newFave.show]
      newProps.fave_shows = [...this.state.currentUser.fave_shows, newFave]
      this.setState({
        currentUser: newProps
      })
    }
    )
  }

  deleteFavorite = (fave) => {
    let faveId = fave.id 
    let newProps = this.state.currentUser
    newProps.shows = this.state.currentUser.shows.filter(show => show.uuid !== fave.show_id)
    newProps.fave_shows = this.state.currentUser.fave_shows.filter(fave => fave.id !== faveId)

    const options = {
      method: "DELETE"
    }

    fetch(`http://localhost:3000/api/v1/fave_shows/${faveId}`, options)
    .then(res => {
      this.setState({
        currentUser: newProps
      })
    })
  }

  
  
  render() {
    
    return (
      <>
        <NavigationBar clearUser={this.clearUser} currentUser={this.state.currentUser} />
        <Switch>
          {this.state.currentUser ? 
          
            <>
              <Route exact path="/shows" render={() => <MainContainer deleteFavorite={this.deleteFavorite} postFavorite={this.postFavorite} renderShow={this.renderShow} currentUser={this.state.currentUser}/>}/>
              <Route exact path="/shows/:uuid" render={() => <ShowShow currentUser={this.state.currentUser} showObj={this.state.currentShow}/>}/>
              <Route exact path={`/user/${this.state.currentUser.id}`} render={() => <Profile deleteFavorite={this.deleteFavorite} postFavorite={this.postFavorite} userObj={this.state.currentUser} confirmUpdates={this.confirmUpdates} confirmDelete={this.confirmDelete} renderShow={this.renderShow}/>}/>
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
