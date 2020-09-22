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
        
        return(
            <>
            {this.state.allUsers.count === 0 ? 
                <div className='loading'>
                    <Spinner className='spinner' animation="grow" role="status">
                        <SvgDeadditMultiLogomark height='200px' width='200px'/>
                    </Spinner>
                </div>
            :
                <>
                <div className="headers">
                        <h2>
                        <strong className="text-secondary"></strong> All Users
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
                </>
            }
            </>
        )
    }
}

export default UserContainer