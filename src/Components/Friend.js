import React from 'react'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import MiniUser from './MiniUser'
import MiniShow from './MiniShow'


class Friend extends React.Component {

    // state = {
    //     friend: this.props.currentFriend
    // }

    // componentDidMount() {
    //     this.setState({friend: this.props.currentFriend})
    // }

    // componentDidUpdate() {
    //     this.setState({friend: this.props.currentFriend})
    // }


    render(){
       console.log(this.props.currentFriend)
        return(
            <>
            {this.props.currentFriend ? 
            
                <>
                <h1 className='headers'>{this.props.currentFriend.username}</h1>
                {/* <SvgDeadditMultiLogomark1 /> */}
                <CardColumns>
                    <Card>
                        <Card.Img className='profimg' variant="top" src={this.props.currentFriend.avatar} />
                        <Card.Body>
                        {/* <Card.Title>User Information</Card.Title> */}
                        <Card.Text>
                            Username: {this.props.currentFriend.username}
                        </Card.Text>
                        <Card.Text>
                            Email: {this.props.currentFriend.email}
                        </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            Placeholder
                            
                        </Card.Footer>
                    </Card>
                    <Card>
                        <Card.Body>
                        <Card.Title>Favorite Shows</Card.Title>
                            {this.props.currentFriend.shows.map((show, index) => {
                                
                                return(
                                    <ListGroup horizontal key={index}>
            
                                        <ListGroup.Item action variant="light"  >
                                        
                                            <MiniShow  showObj={show} deleteFavorite={this.props.deleteFavorite} postFavorite={this.props.postFavorite} renderShow={this.props.renderShow} currentUser={this.props.currentUser}/>
                                
                                        </ListGroup.Item>
                                        
                                    </ListGroup>
                                 )
                            })}
    
                        
                        </Card.Body>
                        <Card.Footer>
                        <small className="text-muted">{this.props.currentFriend.username} has {this.props.currentFriend.shows.length} favorite show(s)</small>
                        </Card.Footer>
                    </Card>
    
                    <Card>
                        <Card.Body>
    
                        <Card.Title>Following</Card.Title>
                        <ListGroup>
                            {this.props.currentFriend.followees.map((followee, index) => {
                                
                                return(
            
                                <ListGroup key={index} horizontal>
                                    
                                    <ListGroup.Item action variant="light"  >
                                        
                                        <MiniUser userObj={followee} unfollowUser={this.props.unfollowUser} followUser={this.props.followUser} renderUser={this.props.renderUser} currentUser={this.props.currentUser}/>
                                        
                                        
                                    </ListGroup.Item>
                                    
                                    {this.props.currentUser.id === followee.id ? 
                                        <ListGroup.Item>Red Stealie for yourself!</ListGroup.Item>
                                    :
                                    this.props.currentUser.followees.find(f => {return f.id === followee.id}) ?
                                        <ListGroup.Item>Click Stealie to Unfollow</ListGroup.Item>
                                    :
                                        <ListGroup.Item>Click Stealie to Follow!!!</ListGroup.Item>
                                    }
            
                               
                                </ListGroup>
                                  
                                )
                            })}
    
                        </ListGroup>
                        
                        <Card.Footer>
                        <small className="text-muted">{this.props.currentFriend.username} is following {this.props.currentFriend.followees.length} user(s)</small>
                        </Card.Footer>
                        </Card.Body>
                            
                        <Card.Body>
                        <Card.Title>Followers</Card.Title>
                        <ListGroup>
                            {this.props.currentFriend.followers.map((follower, index) => {
                                
                                return(
            
                                        <ListGroup.Item action variant="light" key={index}  >
                                        
                                            <p>{follower.username}</p>
                                
                                        </ListGroup.Item>
                                  
                                )
                            })}
    
                        </ListGroup>
                        
                        <Card.Footer>
                        <small className="text-muted">{this.props.currentFriend.username} has {this.props.currentFriend.followers.length} follower(s)</small>
                        </Card.Footer>
                        </Card.Body>
                    </Card>
                </CardColumns>
    
                </>
            :
            null
            }
        </>

        )
    }

}

export default Friend