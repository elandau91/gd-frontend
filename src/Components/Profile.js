import React from 'react'
import MiniUser from './MiniUser'
// import {Link} from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CardColumns from 'react-bootstrap/CardColumns'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import MiniShow from './MiniShow'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
// import SvgDeadditMultiLogomark1 from '../Icons/DeadditMultiLogomark'

class Profile extends React.Component {

    state = {
        edit: false,
        delete: false,
        username: this.props.userObj.username,
        email: this.props.userObj.email,
        avatar: this.props.userObj.avatar
    }

    editHandler = (e) => {
        this.setState({
            edit: !this.state.edit,
            delete: false
        })
    }

    deleteHandler = (e) => {
        this.setState({
            edit: false,
            delete: !this.state.delete
        })
    }

    changeHelper = (e) => {
        this.setState({...this.state, [e.target.name]:e.target.value })
    }

    updateHandler = (e) =>{
        this.props.confirmUpdates(this.state)
        this.setState({edit: false})
    }

    render() {
       
        return(
            <div className='backbaby'>
            <h1 className='headers'>Profile</h1>
            {/* <SvgDeadditMultiLogomark1 /> */}
            <CardColumns>
                <Card>
                    <Card.Img className='profimg' variant="top" src={this.props.userObj.avatar} />
                    <Card.Body>
                    {/* <Card.Title>User Information</Card.Title> */}
                    <Card.Text>
                        Username: {this.props.userObj.username}
                    </Card.Text>
                    <Card.Text>
                        Email: {this.props.userObj.email}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        {
                        this.state.edit ? 
                        <>
                            <Button onClick={this.editHandler} variant="outline-dark">Cancel Edits</Button>
                            <Button onClick={this.deleteHandler} variant="outline-danger">Delete Profile</Button>
                                <br></br>
                                <br></br>
                                <p>Edit your information below:</p>
                            
                            <div>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">New Username</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    // placeholder="Username"
                                    value={this.state.username}
                                    name="username"
                                    aria-describedby="basic-addon1"
                                    onChange={this.changeHelper}    
                                    />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon2">New Email</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                    value={this.state.email}
                                    name="email"
                                    aria-describedby="basic-addon2"
                                    onChange={this.changeHelper}    
                                    />
                                </InputGroup>

                                <label htmlFor="basic-url">New Avatar URL</label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon3">
                                        https://example.com/users/
                                    </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl 
                                    id="basic-url" 
                                    name="avatar"
                                    value={this.state.avatar} 
                                    onChange={this.changeHelper}                                
                                    />
                                </InputGroup>
                                <Button onClick={this.updateHandler} variant="outline-success">Confirm Updates</Button>
                            </div>
                        </>
                        :
                        this.state.delete ?
                        <>
                            <Button onClick={this.editHandler} variant="outline-info">Edit Profile</Button>
                            <Button onClick={this.deleteHandler} variant="outline-dark">Cancel Delete</Button>
                            <br></br>
                            <br></br>
                            <p>Are you sure you'd like to delete your profile?</p>
                            
                            <Button onClick={this.props.confirmDelete} variant="outline-danger">Confirm Delete</Button>
                        </>
                        :
                        <>
                            <Button onClick={this.editHandler} variant="outline-info">Edit Profile</Button>
                            <Button onClick={this.deleteHandler} variant="outline-danger">Delete Profile</Button>
                        </>
                        }
                        
                    </Card.Footer>
                </Card>
                <Card>
                    <Card.Body>
                    <Card.Title>Favorite Shows</Card.Title>
                        {this.props.userObj.shows.map((show, index) => {
                            
                            return(
                                <ListGroup horizontal key={index}>
        
                                    <ListGroup.Item action variant="light"  >
                                    
                                        <MiniShow  showObj={show} deleteFavorite={this.props.deleteFavorite} postFavorite={this.props.postFavorite} renderShow={this.props.renderShow} currentUser={this.props.userObj}/>
                            
                                    </ListGroup.Item>
                                    {/* <ListGroup.Item>Unlike</ListGroup.Item> */}
                                </ListGroup>
                            )
                        })}

                    
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Currently you have {this.props.userObj.shows.length} favorite show(s)</small>
                    </Card.Footer>
                </Card>

                <Card>
                    <Card.Body>

                    <Card.Title>Following</Card.Title>
                    <ListGroup>
                        {this.props.userObj.followees.map((followee, index) => {
                            
                            return(
        
                            <ListGroup key={index} horizontal>
                                
                                <ListGroup.Item action variant="light"  >
                                    
                                    <MiniUser userObj={followee} unfollowUser={this.props.unfollowUser} followUser={this.props.followUser} renderUser={this.props.renderUser} currentUser={this.props.userObj}/>
                                    
                                    
                                </ListGroup.Item>
                                
                                <ListGroup.Item>Click Stealie to Unfollow</ListGroup.Item>
        
                           
                            </ListGroup>
                              
                            )
                        })}

                    </ListGroup>
                    
                    <Card.Footer>
                    <small className="text-muted">Currently you are following {this.props.userObj.followees.length} user(s)</small>
                    </Card.Footer>
                    </Card.Body>
                        
                    <Card.Body>
                    <Card.Title>Followers</Card.Title>
                    <ListGroup>
                        {this.props.userObj.followers.map((follower, index) => {
                            
                            return(
        
                                    <ListGroup.Item action variant="light" key={index}  >
                                    
                                        <p>{follower.username}</p>
                            
                                    </ListGroup.Item>
                              
                            )
                        })}

                    </ListGroup>
                    
                    <Card.Footer>
                    <small className="text-muted">Currently you have {this.props.userObj.followers.length} follower(s)</small>
                    </Card.Footer>
                    </Card.Body>
                </Card>
            </CardColumns>

            </ div>
        )

    }



}

export default Profile