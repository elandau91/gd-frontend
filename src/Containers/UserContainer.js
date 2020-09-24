import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import MiniUser from '../Components/MiniUser'
import Spinner from 'react-bootstrap/Spinner'
import SvgDeadditMultiLogomark from '../Icons/DeadditMultiLogomark'

class UserContainer extends React.Component{

    state = {
        allUsers: []
    }

    componentDidMount() {
        fetch('http://localhost:3000/api/v1/users')
        .then(res => res.json())
        .then(users => this.setState({allUsers: users}))
    }

    render() {
        let filterUsers = this.state.allUsers.filter(user => {return user.username.toLowerCase().includes(this.props.userSearch)})
        return(
            <>
            {this.state.allUsers.count === 0 ? 
                <div className='loading'>
                    <Spinner className='spinner' animation="grow" role="status">
                        <SvgDeadditMultiLogomark height='200px' width='200px'/>
                    </Spinner>
                </div>
            :
            this.props.userSearch !== null ?
            <div className='backbaby'>
            <div className="headers">
                    <h2>
                    <strong >Filtered Users</strong> 
                    </h2>
            </div>

                    {filterUsers.map((user, index) => {
                        return (
                            <ListGroup key={index} horizontal>
                            
                                <ListGroup.Item action variant="light"  >
                                    
                                    <MiniUser userObj={user} unfollowUser={this.props.unfollowUser} followUser={this.props.followUser} renderUser={this.props.renderUser} currentUser={this.props.currentUser}/>
                                    
                                    
                                </ListGroup.Item>
                                {this.props.currentUser.id === user.id ? 
                                <ListGroup.Item>Red Stealie for yourself!</ListGroup.Item>
                                :
                                this.props.currentUser.followees.find(followee => {return followee.id === user.id}) ?
                                <ListGroup.Item>Click Stealie to Unfollow</ListGroup.Item>
                                :
                                <ListGroup.Item>Click Stealie to Follow!!!</ListGroup.Item>
                                }
                           
                            </ListGroup>
                           )
                        })}
            </div>
            :
                <div className='backbaby'>
                <div className="headers">
                        <h2>
                        <strong >All Users</strong> 
                        </h2>
                </div>

                        {this.state.allUsers.map((user, index) => {
                            return (
                                <ListGroup key={index} horizontal>
                                
                                    <ListGroup.Item action variant="light"  >
                                        
                                        <MiniUser userObj={user} unfollowUser={this.props.unfollowUser} followUser={this.props.followUser} renderUser={this.props.renderUser} currentUser={this.props.currentUser}/>
                                        
                                        
                                    </ListGroup.Item>
                                    {this.props.currentUser.id === user.id ? 
                                    <ListGroup.Item>Red Stealie for yourself!</ListGroup.Item>
                                    :
                                    this.props.currentUser.followees.find(followee => {return followee.id === user.id}) ?
                                    <ListGroup.Item>Click Stealie to Unfollow</ListGroup.Item>
                                    :
                                    <ListGroup.Item>Click Stealie to Follow!!!</ListGroup.Item>
                                    }
                               
                                </ListGroup>
                               )
                            })}
                </div>
            }
            </>
        )
    }
}

export default UserContainer