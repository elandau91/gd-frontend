import React from 'react'
// import {Link} from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

class ShowShow extends React.Component {

    state = {
        featuredShow: null,
        comment: false,
        content: ""
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

    
    commentHandler = (e) => {
        this.setState({comment: !this.state.comment})
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitComment = (e) => {
        // console.log(this.state.content)
        // this.props.postComment(this.state.content)
        const options = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              user_id: this.props.currentUser.id,
              show_id: this.state.featuredShow.uuid,
              content: this.state.content
            })
          }
      
          fetch(`http://localhost:3000/api/v1/comment_shows`, options)
          .then(res => res.json())
          .then(newComment => {
              let newShow = this.state.featuredShow
              newShow.comment_shows = [...this.state.featuredShow.comment_shows, newComment]
              newShow.users = [...this.state.featuredShow.users, newComment.user]

              this.setState({
                  featuredShow: newShow,
                  comment: false
              })
          })
    }

    removeComment = (comment) => {
        const options = {
            method: "DELETE"
        }

        fetch(`http://localhost:3000/api/v1/comment_shows/${comment.id}`, options)
        .then(res => {
            let lessShow = this.state.featuredShow
            lessShow.comment_shows = this.state.featuredShow.comment_shows.filter(cs => cs.id !== comment.id)

            this.setState({featuredShow: lessShow})
        })
    }


    render() {
        // console.log(this.state.featuredShow)
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
                                            <ListGroup.Item action variant="no style" key={index}>
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
                            <Card.Title className="title">Comments</Card.Title>
                            {this.state.comment ? 
                                <>
                                <Button onClick={this.commentHandler} className='addcomment' variant="outline-dark">Cancel Comment</Button>
                                <p></p>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>Add Comment Here:</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl onChange={this.changeHandler} name="content" as="textarea" aria-label="With textarea" />
                                    <InputGroup.Append>
                                    <Button onClick={this.submitComment} variant="outline-success">Submit</Button>
                                     </InputGroup.Append>
                                </InputGroup>
                                </>
                                :
                                <>
                                <Button onClick={this.commentHandler} className='addcomment' variant="outline-info">Add Comment</Button>
                                <p></p>
                                </>
                            }
                                
                            <ListGroup >

                                {this.state.featuredShow.comment_shows.map((comment, index) => {
                                        
                                    let user = this.state.featuredShow.users.find(user => { return user.id === comment.user_id})
                                    return(
                                        <ListGroup.Item action variant="no style" key={index}>
                                            {comment.content}
                                            <p><small className="text-muted">-{user.username}</small></p>
                                            {this.props.currentUser.id === user.id ? 
                                            <Button onClick={() => this.removeComment(comment)} className="faveshows" size="sm" variant="outline-dark" >Remove Comment</Button>
                                            :
                                            null
                                            }
                                        </ListGroup.Item>
                                    )
                                })}
                            </ListGroup>
                        </Card.Body>
                        <Card.Footer>
                        <small className="text-muted">Currently there are {this.state.featuredShow.comment_shows.length} comments</small>
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