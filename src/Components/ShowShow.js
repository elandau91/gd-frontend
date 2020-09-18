import React from 'react'
import {Link} from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import ListGroup from 'react-bootstrap/ListGroup'


class ShowShow extends React.Component {

    state = {
        featuredShow: null
    }


    componentDidMount() {
        fetch(`http://localhost:3000/api/v1/shows/${this.props.showObj.uuid}`)
        .then(res => res.json())
        .then(showFetch => {
            this.setState({
                featuredShow: showFetch
                }
            )
        })
    }

    



    render() {
        
        return(
            <>
            {
                this.state.featuredShow === null ?
                <h1>loading!</h1>
            :   

                <>
                <h3 className='test' >{this.state.featuredShow.venue}, {this.state.featuredShow.city}, {this.state.featuredShow.state} - {this.state.featuredShow.day}/{this.state.featuredShow.month}/{this.state.featuredShow.year}</h3>
                <CardGroup>
                    <Card>
                        <Card.Body>
                            <Card.Title>Setlist</Card.Title>
                                <ListGroup >

                                    {this.state.featuredShow.song_refs.map((song, index) => {
                                        return(
                                            <ListGroup.Item key={index}>
                                                {song.name}
                                            </ListGroup.Item>
                                        )
                                    })}
                                </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Setlist of {this.state.featuredShow.song_refs.length} songs</small>
                        </Card.Footer>
                    </Card>
                    <Card>
                        <Card.Body>
                                <Card.Title>Comments</Card.Title>
                        </Card.Body>
                        <Card.Footer>

                        </Card.Footer>
                    </Card>
                </CardGroup>
                
                


                </>
            }

            </>
        )
    }

}

export default ShowShow