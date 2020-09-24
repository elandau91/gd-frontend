import React from 'react';
import './App.css';
import MainContainer from './Containers/MainContainer'
import UserContainer from './Containers/UserContainer'
import LoginForm from './Components/LoginForm'
import SignupForm from './Components/SignupForm'
import NavigationBar from './Components/NavigationBar'
import Profile from './Components/Profile'
import Friend from './Components/Friend'
import { Route, Switch, withRouter} from 'react-router-dom'
import ShowShow from './Components/ShowShow';

class App extends React.Component {
  
  state = {
    currentUser: null,
    currentShow: null,
    currentFriend: null,
    userSearch: null
  }


  clearUser = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("show")
    localStorage.removeItem("friend")
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
          this.setState({
            currentUser: data.user,
            currentFriend: data.user
          }, ()=> this.props.history.push("/shows"))
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
    const friendString = localStorage.getItem("friend")
    const show = JSON.parse(showString)
    const friend = JSON.parse(friendString)
    
    
    if (token) {
      fetch('http://localhost:3000/api/v1/profile', {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
      }).then(res => res.json())
        .then(user => {
          this.setState(
            {currentUser: user.user,
             currentShow: show,
             currentFriend: friend
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

  unfollowUser = (info) => {
    // console.log(this.state.currentUser)
    let newProps = this.state.currentUser
    newProps.followees = this.state.currentUser.followees.filter(followee => followee.id !== info.id)
    let del = this.state.currentUser.followed_users.filter(fu => fu.followee_id === info.id)
    newProps.followed_users = this.state.currentUser.followed_users.filter(fu => fu.followee_id !== info.id) 

    const options = {
      method: "DELETE"
    }

    fetch(`http://localhost:3000/api/v1/follows/${del[0].id}`, options)
    .then(res => {
      this.setState({currentUser: newProps})
    })
  }

  followUser = (info) => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        follower_id: this.state.currentUser.id,
        followee_id: info
      })
    }

    fetch(`http://localhost:3000/api/v1/follows`, options)
    .then(res => res.json())
    .then(followed => {
      let newProps = this.state.currentUser
      newProps.followees = [...this.state.currentUser.followees, followed.followee]
      newProps.followed_users = [...this.state.currentUser.followed_users, followed]
      this.setState({
        currentUser: newProps
      })

    })
  }

  renderUser = (userObj) => {
    fetch(`http://localhost:3000/api/v1/users/${userObj.id}`)
        .then(res => res.json())
        .then(user => {
          console.log(user)
          localStorage.setItem("friend", JSON.stringify(user))
          console.log(localStorage)
          this.setState({
            currentFriend: user
          }
          // , () => this.props.history.push(`/users/${user.id}`) 
          )
        })
  }

  searchForUser = (searchTerm) => {
    this.setState({...this.state, userSearch: searchTerm}, () => this.props.history.push("/users"))
  }
  
  
  render() {
    //console.log(process.env.REACT_APP_GENIUS_KEY)
    return (
      <>
        <NavigationBar searchForUser={this.searchForUser} clearUser={this.clearUser} currentUser={this.state.currentUser} />
          {
            this.state.currentUser ? 
            
            <>
            <Switch>
              <Route exact path="/shows" render={() => <MainContainer deleteFavorite={this.deleteFavorite} postFavorite={this.postFavorite} renderShow={this.renderShow} currentUser={this.state.currentUser}/>}/>
              <Route exact path="/shows/:uuid" render={() => <ShowShow currentUser={this.state.currentUser} showObj={this.state.currentShow}/>}/>
              <Route exact path={`/users/${this.state.currentUser.id}`} render={() => <Profile renderUser={this.renderUser} currentFriend={this.state.currentFriend} unfollowUser={this.unfollowUser} followUser={this.followUser} deleteFavorite={this.deleteFavorite} postFavorite={this.postFavorite} userObj={this.state.currentUser} confirmUpdates={this.confirmUpdates} confirmDelete={this.confirmDelete} renderShow={this.renderShow}/>}/>
              <Route path={`/users/:id`} render={() => <Friend currentFriend={this.state.currentFriend} renderUser={this.renderUser} unfollowUser={this.unfollowUser} followUser={this.followUser} deleteFavorite={this.deleteFavorite} postFavorite={this.postFavorite} renderShow={this.renderShow} currentUser={this.state.currentUser}/>} />
              <Route exact path="/users" render={() => <UserContainer userSearch={this.state.userSearch} renderUser={this.renderUser} unfollowUser={this.unfollowUser} followUser={this.followUser} currentUser={this.state.currentUser} />} />
            </Switch>
            </>
          :
            <>
              <Route exact path="/" render={() => <LoginForm loginHandler={this.loginHandler} /> } />
              <Route path="/createuser"  render={() => <SignupForm createHandler={this.createHandler}/> }/>  
            </>
          }
      </>
    );
  }


}

export default withRouter(App);
