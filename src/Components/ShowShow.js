import React from 'react'
// import {Link} from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { getSong } from 'genius-lyrics-api';
import SvgDeadditMultiLogomark from '../Icons/DeadditMultiLogomark'
// import Spinner from 'react-bootstrap/Spinner'



class ShowShow extends React.Component {

    state = {
        featuredShow: null,
        comment: false,
        content: "",
        showLyrics: "",
        song: "",
        albumArt: ""
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

    lyricHandler = (e) => {
        this.setState({showLyrics: "", song: ""})
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

    fetchSong = (e) => {
       let clickedSong = e.target.textContent
        
        const options = {
            apiKey: process.env.REACT_APP_GENIUS_KEY,
            title: clickedSong,
            artist: 'Grateful Dead',
            optimizeQuery: true
        };

        let cors_api_host = 'cors-anywhere.herokuapp.com';
        let cors_api_url = 'https://' + cors_api_host + '/';
        let slice = [].slice;
        let origin = window.location.protocol + '//' + window.location.host;
        let open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            let args = slice.call(arguments);
            let targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
            if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
                targetOrigin[1] !== cors_api_host) {
                args[1] = cors_api_url + args[1];
            }
            return open.apply(this, args);
        };
        
        getSong(options).then((song) => {
            // console.log(`
            // ${song.id}
            // ${song.url}
            // ${song.albumArt}
            // ${song.lyrics}`)
            // console.log(song.lyrics)
            if (song === null) {
                this.setState({song: clickedSong})
            } else {

                this.setState({
                    showLyrics: song.lyrics, 
                    song: clickedSong,
                    albumArt: song.albumArt
                })
            }

            }
        );

        //getLyrics(options).then((lyrics) => this.setState({showLyrics: lyrics, song: clickedSong}))
    }


    render() {
        // let paragraphs = this.state.showLyrics.split(/[[]]/)
        // console.log(paragraphs)
        // console.log("how many times?")
        return(
            <>
            {
                this.state.featuredShow === null ?
                <h1>loading!</h1>
            :   

                <div className='backbaby'>
                <h3 className='test' >{this.state.featuredShow.venue}, {this.state.featuredShow.city}, {this.state.featuredShow.state} - {this.state.featuredShow.day}/{this.state.featuredShow.month}/{this.state.featuredShow.year}</h3>
                <CardGroup>
                    <Card>
                        <Card.Body>
                            <Card.Title>Setlist <small className="text-muted">(click song for more info)</small></Card.Title>
                                <ListGroup >

                                    {this.state.featuredShow.song_refs.length === 0 ?
                                    <p>No setlist for this show unfortunately :(</p>
                                    :
                                    
                                    this.state.featuredShow.song_refs.map((song, index) => {
                                        return(
                                            <ListGroup.Item action variant="no style" key={index} onClick={this.fetchSong}>
                                                {song.name}
                                                {this.state.song === song.name ? 
                                                <SvgDeadditMultiLogomark className="likes"/>
                                                :
                                                null
                                                }
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
                            {this.state.showLyrics ?
                            <>
                            
                            <Card.Title className="title">{this.state.song}</Card.Title>
                            <Button onClick={this.lyricHandler} className='addcomment' variant="outline-dark">Hide Lyrics</Button>
                            
                            <br></br>
                            <br></br>
                            
                                <img className='profimg' alt='album art' src={this.state.albumArt}/>
                           
                            <Card.Body>
                                {this.state.showLyrics[0] === "[" ?
                                this.state.showLyrics.split("[").slice(1).map((para, index) => {
                                        return(
                                            <div key={index}>
                                                <p>[{para}</p>
                                                <br></br>
                                            </div>
                                        )
                                    })
                                :
                                    <div >
                                        <p>{this.state.showLyrics}</p>
                                        <br></br>
                                    </div>
                                
                                }
                            
                            </Card.Body>
                            
                            </>
                            :
                            this.state.comment ? 
                            <>
                            <Card.Title className="title">Comments</Card.Title>
                                <Button onClick={this.commentHandler} className='addcomment' variant="outline-dark">Cancel Comment</Button>
                                <p></p>
                                <br></br>
                                <br></br>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                    <InputGroup.Text>Add Comment Here:</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl onChange={this.changeHandler} name="content" as="textarea" aria-label="With textarea" />
                                    <InputGroup.Append>
                                    <Button onClick={this.submitComment} variant="outline-success">Submit</Button>
                                     </InputGroup.Append>
                                </InputGroup>
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
                                </>
                            :
                            <>
                                <Card.Title className="title">Comments</Card.Title>
                                <Button onClick={this.commentHandler} className='addcomment' variant="outline-info">Add Comment</Button>
                                <p></p>
                                <br></br>
                                <br></br>
                            
                                
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

                            </>
                            }

                        </Card.Body>
                        <Card.Footer>
                        <small className="text-muted">Currently there are {this.state.featuredShow.comment_shows.length} comments</small>
                        </Card.Footer>
                    </Card>
                </CardGroup>
                
                


                </div>
            }

            </>
        )
    }

}

export default ShowShow