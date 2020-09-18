import React from 'react'
import {Link} from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import MiniShow from './MiniShow'

class Profile extends React.Component {


    render() {
        
        return(
            <>
            <h1 className='headers'>Profile</h1>
            <CardGroup>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                    <Card.Title>User Information</Card.Title>
                    <Card.Text>
                        Username: {this.props.userObj.username}
                    </Card.Text>
                    <Card.Text>
                        Email: {this.props.userObj.email}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Joined in 2020</small>
                    </Card.Footer>
                </Card>
                <Card>
                    <Card.Img variant="top" src="holder.js/100px160" />
                    <Card.Body>
                    <Card.Title>Favorite Shows</Card.Title>
                    <ListGroup>
                        {this.props.userObj.shows.map((show, index) => {
                            
                            return(
                                <Link key={index} style={{ textDecoration: 'none' }} to={`/shows/${show.uuid}`}>
                                    <ListGroup.Item onClick={() => this.props.renderShow(show)} >
                                    
                                        <MiniShow  showObj={show} />
                            
                                    </ListGroup.Item>
                                </Link>
                            )
                        })}

                    </ListGroup>
                    
                    </Card.Body>
                    <Card.Footer>
                    <small className="text-muted">Currently you have {this.props.userObj.shows.length} favorite show(s)</small>
                    </Card.Footer>
                </Card>
            </CardGroup>

            </>
        )

    }



}

export default Profile