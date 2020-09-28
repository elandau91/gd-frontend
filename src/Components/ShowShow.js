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
import PlayWidget from 'react-spotify-widgets';
// import Spinner from 'react-bootstrap/Spinner'



class ShowShow extends React.Component {

    state = {
        featuredShow: null,
        comment: false,
        content: "",
        showLyrics: "",
        song: "",
        //albumArt: "",
        songURI: "",
        showURI: ""
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

    clearSpotify = (e) => {
        this.setState({showURI: ""})
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
       let songChoice
        
        for (const key in songCatalog) {
            if (key === clickedSong) {
                songChoice = songCatalog[key]
            }
        }
        
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
                    //albumArt: song.albumArt,
                    songURI: songChoice
                })
            }

            }
        );

        //getLyrics(options).then((lyrics) => this.setState({showLyrics: lyrics, song: clickedSong}))
    }

    spotifyCheck = (e) => {
        console.log(this.state.featuredShow)
        let showChoice
        let sampleShow = this.state.featuredShow
        
        sampleShow.month = this.minTwoDigits(sampleShow.month )
        sampleShow.day = this.minTwoDigits(sampleShow.day)

        // console.log(`${sampleShow.month}/${sampleShow.day}/${sampleShow.year}`)
        // console.log(showCatalog)
        
        for (const key in showCatalog) {
            if (key === `${sampleShow.month}/${sampleShow.day}/${sampleShow.year}`) {
                
                showChoice = showCatalog[key]

            } 
            // else {
            //     console.log(key)
            //     showChoice = 'nada'
            // }
        }
        
        console.log(showChoice)

        this.setState({...this.state, showURI: showChoice})

        //console.log(showChoice)
    }

    minTwoDigits = (n) => {
        //console.log("number", n, "length", n.length)
      return (n.length === 1 || (n.length === undefined && n < 10) ? '0' : '') + n;
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
                <h3 className='test' >{this.state.featuredShow.venue}, {this.state.featuredShow.city}, {this.state.featuredShow.state} - {this.state.featuredShow.month}/{this.state.featuredShow.day}/{this.state.featuredShow.year}</h3>
                
                <CardGroup>
                    <Card>
                        <Card.Body>
                            <Card.Title className="title">Setlist <small className="text-muted">(click song for more info)</small></Card.Title>
                            {this.state.showURI || this.state.showURI === undefined ?
                            <Button onClick={this.clearSpotify} className='addcomment' variant="outline-dark">Hide Spotify</Button>
                            :
                            <Button onClick={this.spotifyCheck} className='addcomment' variant="outline-success">Spotify?</Button>
                            }
                            
                            <br></br>
                            <br></br>
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
                            {this.state.showURI === undefined ?
                            <>
                            <Card.Title className="spotifytitle">No Spotify</Card.Title>
                    
                            </>
                            :
                            this.state.showURI.length > 4 ?
                            <>
                            <Card.Title className="spotifytitle">Yes Spotify</Card.Title>
                            
                            <div className='spotify'>

                            <PlayWidget
                                width={400}
                                height={580}
                                uri={this.state.showURI}
                                />
                            </div>
                            </>
                            :
                            this.state.showLyrics ?
                            
                            <>
                            
                            <Card.Title className="title">{this.state.song}</Card.Title>
                            <Button onClick={this.lyricHandler} className='addcomment' variant="outline-dark">Hide Lyrics</Button>
                            
                            <br></br>
                            <br></br>
                            
                                {/* <img className='profimg' alt='album art' src={this.state.albumArt}/> */}
                                <PlayWidget
                                    width={300}
                                    height={80}
                                    uri={`spotify:track:${this.state.songURI}`}
                                    />
                                
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


const showCatalog = {
    "02/23/1968": 'spotify:album:2aipUPHU0KrGAq2QaAvlOz',
    "02/24/1968": 'spotify:album:2aipUPHU0KrGAq2QaAvlOz',
    "03/17/1968": 'spotify:album:04BKBau3lJBVp0xY5wzmPW',
    "08/23/1968": 'spotify:album:1bKxygqnMcS7twRhGMK36U',
    "08/24/1968": 'spotify:album:1bKxygqnMcS7twRhGMK36U',
    "01/26/1969": 'spotify:album:6E7JCQINTT4vwRF4wBcsYk',
    "02/11/1969": 'spotify:album:4Oo46t2jDGsb7Ka3hqZCgy',
    "02/27/1969": 'spotify:album:6E7JCQINTT4vwRF4wBcsYk',
    "02/28/1969": 'spotify:album:7vAB87YflHzcgkuIp8RprK',
    "03/01/1969": 'spotify:album:7vAB87YflHzcgkuIp8RprK',
    "03/02/1969": 'spotify:album:6E7JCQINTT4vwRF4wBcsYk',
    "04/17/1969": 'spotify:album:5qtj5KMkzFx1270VxODSkD',
    "04/26/1969": 'spotify:album:50rpHqRFD3K7bCTRBtraGH',
    "04/27/1969": 'spotify:album:50rpHqRFD3K7bCTRBtraGH',
    "11/08/1969": 'spotify:album:1GbnL43DSgDRIIvKTVDSjP',
    "01/18/1970": 'spotify:album:34ZSMxipFp6GVTLUVmc009',
    "02/13/1970": 'spotify:album:518Uq6B4Y3X1EnNr8SsGQ7',
    "02/14/1970": 'spotify:album:518Uq6B4Y3X1EnNr8SsGQ7',
    "05/02/1970": 'spotify:album:4NldodakYXDeK7OoEe2oBW',
    "07/04/1970": 'spotify:album:7nsrYIDrEZvCjH4Eh53uTo',
    "02/21/1971": 'spotify:album:4m3LKjFymPkRQeST1KEbT0',
    "04/25/1971": 'spotify:album:4limgkCDpuhOUIrUz0U7ly',
    "04/26/1971": 'spotify:album:4limgkCDpuhOUIrUz0U7ly',
    "04/27/1971": 'spotify:album:4limgkCDpuhOUIrUz0U7ly',
    "04/28/1971": 'spotify:album:4limgkCDpuhOUIrUz0U7ly',
    "04/29/1971": 'spotify:album:4limgkCDpuhOUIrUz0U7ly',
    "08/06/1971": 'spotify:album:3jzf0bKlIMjSQNk5wibVHT',
    "08/07/1971": 'spotify:album:3jzf0bKlIMjSQNk5wibVHT',
    "08/21/1971": 'spotify:album:3jzf0bKlIMjSQNk5wibVHT',
    "10/26/1971": 'spotify:album:0lyrgO8Pmo87VJqP6ej4Ax',
    "10/31/1971": 'spotify:album:45uNoDchZ61dBfOWGqeG0l',
    "03/25/1972": 'spotify:album:1cnArqU8gDNK2pPksZsQZw',
    "03/28/1972": 'spotify:album:1cnArqU8gDNK2pPksZsQZw',
    "04/07/1972": 'spotify:album:6j3vuVPhMRB0H5CgPZ8wTd',
    "04/08/1972": 'spotify:album:75u5l9TfTohni1xWrAUfxe',
    "04/11/1972": 'spotify:album:65WlVRyo45LwtRg8QJfya3',
    "04/14/1972": 'spotify:album:7l9AfB3E5teHyZ0g7WDlx1',
    "04/16/1972": 'spotify:album:3eeKCzpqxZ68pBvyjKPvn9',
    "04/17/1972": 'spotify:album:6Yw0qA9xNfFpkSwzwIOwOW',
    "04/21/1972": 'spotify:album:32h6hF1i79qgFGwVh0qTJk',
    "04/24/1972": 'spotify:album:1QPPIh78A5yXL9Lux8oPp7',
    "04/26/1972": 'spotify:album:1iZbyAj4kT1U8lXtu4t415',
    "04/29/1972": 'spotify:album:1WBPhea5H2NnDaNuAFI0Fr',
    "05/03/1972": 'spotify:album:4avLivYQqNDnkxfMDTSIsJ',
    "05/04/1972": 'spotify:album:3S1abYMND9BSJzbMcpJhj8',
    "05/07/1972": 'spotify:album:2dey7kGDFAByEACexapiV6',
    "05/10/1972": 'spotify:album:5T7RvMATOxVnCM4Q32S7vH',
    "05/11/1972": 'spotify:album:2GVmIIvRpvCwQbvBNUM2K4',
    "05/13/1972": 'spotify:album:6CMuGqQsNf5TRxFBSGY2JT',
    "05/16/1972": 'spotify:album:7d3bghzAeP1NN27apW1YTI',
    "05/18/1972": 'spotify:album:0M7PIylsjtbgDxZCf1tef4',
    "05/23/1972": 'spotify:album:1K4AvpTllYaNUNcRYw9Pyn',
    "05/24/1972": 'spotify:album:3EZpSEJ1k1BovW6Tp2Klz1',
    "05/25/1972": 'spotify:album:29pkQOWIBGGFD1EncVkILn',
    "05/26/1972": 'spotify:album:6tgzqy3Keqge7DAPRw2asB',
    "07/21/1972": 'spotify:album:0nMKTUPdDm7Zk5WbIfjTKg',
    "08/27/1972": 'spotify:album:1E4MXxSYoAMN5qpy1y6aBm',
    "09/17/1972": 'spotify:album:7gyyunPy7dVsDB4cp7ZReW',
    "09/21/1972": 'spotify:album:1lNa8R1EuIfJz9zhZ0H1vx',
    "09/27/1972": 'spotify:album:2pPrEb0IJFk3W6NoQSMnZM',
    "02/26/1973": 'spotify:album:0xp6JpT8jrnK0FV4Xf4MG0',
    "02/28/1973": 'spotify:album:0xp6JpT8jrnK0FV4Xf4MG0',
    "06/22/1973": 'spotify:album:3EUx54No5UpMca8zIyTpbd',
    "06/24/1973": 'spotify:album:3EUx54No5UpMca8zIyTpbd',
    "10/19/1973": 'spotify:album:1GU8dYooagGR6jBwbdsGCr',
    "11/30/1973": 'spotify:album:69UIkpF0CA8RJQqCsrGgLo',
    "12/02/1973": 'spotify:album:69UIkpF0CA8RJQqCsrGgLo',
    "12/10/1973": 'spotify:album:700QCCumNYFQgg22mArrAw',
    "12/19/1973": 'spotify:album:7kllcqzsmi744saUQQ7DiB',
    "03/23/1974": 'spotify:album:4jiBYEFx7rv6C6UTYywZZO',
    "05/17/1974": 'spotify:album:3EUx54No5UpMca8zIyTpbd',
    "05/19/1974": 'spotify:album:3EUx54No5UpMca8zIyTpbd',
    "05/21/1974": 'spotify:album:3EUx54No5UpMca8zIyTpbd',
    "06/26/1974": 'spotify:album:0B87pzzLQzyevvMvdcJqHZ',
    "06/28/1974": 'spotify:album:0B87pzzLQzyevvMvdcJqHZ',
    "08/04/1974": 'spotify:album:0EgV8QqWBeSt1U6MBK6NnC',
    "08/05/1974": 'spotify:album:0EgV8QqWBeSt1U6MBK6NnC',
    "09/09/1974": 'spotify:album:2tDQBnR5OrbHg8mfGbetxf',
    "09/11/1974": 'spotify:album:2tDQBnR5OrbHg8mfGbetxf',
    "08/13/1975": 'spotify:album:7K5jvjbQB05gnFxsgwPvmt',
    "06/18/1976": 'spotify:album:5h5Wx6ltrPyzb7yRFPzEyX',
    "06/21/1976": 'spotify:album:5h5Wx6ltrPyzb7yRFPzEyX',
    "09/25/1976": 'spotify:album:34KjKiNyuggM0g2No4ZnTv',
    "09/28/1976": 'spotify:album:34KjKiNyuggM0g2No4ZnTv',
    "10/09/1976": 'spotify:album:4sY292VqKmwyj1RYlhBFoA',
    "10/10/1976": 'spotify:album:4sY292VqKmwyj1RYlhBFoA',
    "04/30/1977": 'spotify:album:3PT8V8Rok86NvRgdP92yj9',
    "05/08/1977": 'spotify:album:3T9UKU0jMIyrRD0PtKXqPJ',
    "05/19/1977": 'spotify:album:4nuyKoY91WKwR6HLq7Gzkl',
    "05/21/1977": 'spotify:album:4nuyKoY91WKwR6HLq7Gzkl',
    "05/22/1977": 'spotify:album:3KxT9J6KTuKeXox9BUikZ4',
    "05/28/1977": 'spotify:album:6aODZ83mana5oClW6sXEkx',
    "09/03/1977": 'spotify:album:5uzn9YQ9XS2OoAt65U8Drg',
    "11/05/1977": 'spotify:album:24rc4HaQfvOOSnq32PkOC1',
    "12/29/1977": 'spotify:album:1ZMr1r6Lxv79dhy4qHZHkK',
    "02/03/1978": 'spotify:album:1eXlwGtPpBs59cULO5gb4i',
    "02/05/1978": 'spotify:album:1eXlwGtPpBs59cULO5gb4i',
    "05/10/1978": 'spotify:album:1C1qBy9KA5ddXkl6Ya82gr',
    "05/11/1978": 'spotify:album:1C1qBy9KA5ddXkl6Ya82gr',
    "07/08/1978": 'spotify:album:6q4mDbsYJsixRai11qc2Vx',
    "09/15/1978": 'spotify:album:1T3gjxFeNGxmbP697kIQ69',
    "09/16/1978": 'spotify:album:1T3gjxFeNGxmbP697kIQ69',
    "12/31/1978": 'spotify:album:3RtA7CxOnsJvfipdg4A3U8',
    "12/26/1979": 'spotify:album:5HS80DlI8zRtS34wyS6iaR',
    "05/15/1980": 'spotify:album:0WjqABEwiclklIWJtKfVga',
    "05/16/1980": 'spotify:album:0WjqABEwiclklIWJtKfVga',
    "09/03/1980": 'spotify:album:0e0DiVVupxN4D9xOspyKRU',
    "09/04/1980": 'spotify:album:0e0DiVVupxN4D9xOspyKRU',
    "09/30/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/07/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/10/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/11/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/13/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/26/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/27/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "10/30/1980": 'spotify:album:1T7YIthjEvwsxbUHZ7NdBD',
    "05/06/1981": 'spotify:album:5KhX09Ik4LFkLGgwz6DxJa',
    "08/07/1982": 'spotify:album:3Nru2SaW3yVSxqHbWNXcwc',
    "10/14/1983": 'spotify:album:0MUCSAd1FNHH0MQBEKVxm2',
    "11/01/1985": 'spotify:album:4QLlTAC9pOzbZo7qQ63dXm',
    "07/04/1987": 'spotify:album:2H8oXIOkww0RuVckCa6Scw',
    "07/19/1987": 'spotify:album:2H8oXIOkww0RuVckCa6Scw',
    "07/24/1987": 'spotify:album:2H8oXIOkww0RuVckCa6Scw',
    "07/26/1987": 'spotify:album:2H8oXIOkww0RuVckCa6Scw',
    "03/27/1988": 'spotify:album:3LzNGrAGOmLbdQRSRcJzxf',
    "04/02/1989": 'spotify:album:7CuPAAL41j1vEjYTjNh2OA',
    "04/03/1989": 'spotify:album:7CuPAAL41j1vEjYTjNh2OA',
    "07/07/1989": 'spotify:album:1ILNO0v1Natm87x5UPedHh',
    "10/08/1989": 'spotify:album:6ha88H8pRux3VDEkp3S55P',
    "10/09/1989": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "10/15/1989": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "10/16/1989": 'spotify:album:31bICy4msxPCUrDJbRiaYm',
    "10/19/1989": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "12/09/1989": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "03/14/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "03/15/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "03/16/1990": 'spotify:album:6qO4txEK5NKSHz3L4GAD5x',
    "03/18/1990": 'spotify:album:4bP67icXZAeeAoDlEaa0Th',
    "03/19/1990": 'spotify:album:6qO4txEK5NKSHz3L4GAD5x',
    "03/21/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "03/22/1990": 'spotify:album:6qO4txEK5NKSHz3L4GAD5x',
    "03/24/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "03/25/1990": 'spotify:album:3DQoclC4aJ99gOnmYQUyWx',
    "03/26/1990": 'spotify:album:3DQoclC4aJ99gOnmYQUyWx',
    "03/28/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "03/29/1990": 'spotify:album:7xWKImlu9fzB1ApqoLLMiL',
    "03/30/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "04/01/1990": 'spotify:album:6HyLzcuUZALOpAGnArJB8G',
    "04/03/1990": 'spotify:album:4bP67icXZAeeAoDlEaa0Th',
    "09/16/1990": 'spotify:album:2Ki3onvS212d1YPeduDkCk',
    "06/17/1991": 'spotify:album:1f0whW4QE9bFNLpeyaPQiV',
    "06/20/1991": 'spotify:album:67fPMapwwewntR68xRwqfM',
    "09/25/1991": 'spotify:album:1rZjJhRyYT3MAQrCSxoF6D',
    "06/23/1992": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
    "06/29/1992": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
    "12/16/1992": 'spotify:album:1ao7jrAGQ6xf6ywjbKM8vU',
    "12/17/1992": 'spotify:album:1ao7jrAGQ6xf6ywjbKM8vU',
    "09/13/1993": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
    "10/14/1994": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
    "12/11/1994": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
    "03/30/1995": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
    "04/02/1995": 'spotify:album:2fKy7P6G5wV80UHfqCuBwS',
}



const songCatalog = {
 "Alabama Getaway": '6MjGugpOlSauS7CrYZgqDw',
 'All Along The Watchtower': '5LbmdmT7vxm2w3C5eNERkM',
 'Alligator': '5jw506v9jjtEOSYFc08K3x',
 'Althea': '5No7dABuBlNyCGsj7Eegop',
 'And We Bid You Good Night': '1NyaKoa49N1DXqUPrqR9H6',
 'Are You Lonely For Me Baby?': '6n2q9hCLbIwKesMi4aFXZn',
 'Around And Around': '0Qi2Jr7hlQ3CfEZhbfL1h6',
 'Attics Of My Life': '5U0lHydo7tQh5t3dxHpQzu',
 "Baba O'riley": '4JvhwL1GCt16DEGPmUd2AF',
 'Ballad Of A Thin Man': '6eoRVpCJiK9xu6yr7At5aW',
 'Beat It On Down The Line': '5lJNGSIAI8P6UlgDhjV2I1',
 'Believe It Or Not': '019hso36RCSNmvlwUcAn0b',
 'Bertha': '3ZYSrBWQXYgTe4tyKKIZ0D',
 'Big Boss Man': '7iFlT9cRGMoM3OHWiXO4MI',
 'Big Railroad Blues': '51VBp0JHnMTFh6JvwPgk9Z',
 'Big River': '0Vca2qGgBjR27hAXrmnHVR',
 'Bird Song': '2bP0hBSLVzkj8guIov0SLS',
 'Black Muddy River': '6LpXex2zyOAeBaF6OxXqsZ',
 'Black Peter': '7sAbS0MJUEzxL4TyrlL6Kq',
 'Black Throated Wind': '4Vqb5hmeuC2GOUGx2LG0Wx',
 'Blow Away': '7htydqbMWsrOaU2NNTS5FK',
 'Blues For Allah': '5yxKNixc5dm7AC6mPSTrKL',
 'Born Cross Eyed': '5Bpf8KYCE38ZZKdaikfzTz',
 'Box Of Rain': '7x2xjJV3YAPeLQJ7u3Kjet',
 'Brokedown Palace': '362CS15hE1upuTKoWApzLn',
 'Broken Arrow': '2mdpsJkvd5ouIvT8Q8juEW',
 'Brown Eyed Women': '1BlJdQjT6QYjRlfP0C1rz1',
 'Built To Last': '77QebBESSSgseLTSbRHchX',
 'C.C. Rider': '1pPTLrDTWjGsnmobb0pBxM',
 "California Earthquake (Whole Lotta Shakin' Goin' On)": '1eIxmiffN7xKMdByqBJELa',
 "Can't Come Down": '006U6PCNKBKyOLC9Qw2i73',
 'Candyman': '4FJ0051ukEptZAhP01ExGV',
 'Casey Jones': '7FxxBNwN27gcqRjzSE6T9N',
 'Cassidy': '3Ytea3b7VXXkVTN2mRpjvB',
 'Caution (Do Not Stop On Tracks)': '3C3Ytp3IHTkmUUsZI4ohJ6',
 'China Cat Sunflower': '0lbWWoUhUnNMKnqTr2BKNH',
 'China Doll': '0uTDZqdS4icbKN4gEIUf2d',
 'Chinatown Shuffle': '2mPHASJC8WjYOBODlwFlcX',
 'Clementine': '6LNX32x92GkRJjxvGZeXng',
 'Cold Jordan': '7x7bK1eQaJ07rL6SqjOLzq',
 'Cold Rain And Snow': '4E5zxkicJvjp6dSDkvXuMD',
 'Comes A Time': '2WWgheiMh4KnLkZk4IVIEf',
 'Corrina': '6ZYUOnzDYyP8MrxJpEPKos',
 'Cosmic Charlie': '6H3ZEJIMu87f5Gfcsl5zhC',
 'Crazy Fingers': '6Obp165E1szELuAP7p96Zb',
 'Cryptical Envelopment': '4J600IjlMsYebVs0EvszX4',
 'Cumberland Blues': '1pM0qOb7tljJUQUj9Oyj1P',
 'Dancing In The Street': '2QzPMbdAR5Fb8DkiViiZrM',
 'Dark Hollow': '5SWDIe8j5vhBZZkU11Cmjj',
 'Dark Star': '07CwWCJetytT1cSnQOgRMU',
 'Dark Star Jam': '2aVPIpHsJEtN5IiLC1oora',
 'Deal': '0pPvu1AGxIj7pvESvSg4wi',
 'Dear Mr. Fantasy': '56o0uObvuYKJ93VTpfEf9Q',
 "Death Don't Have No Mercy": '2XQiGmcYQXOCYgUdXCe0Y3',
 'Deep Elem Blues': '2tu3n4gB1LUbuvnjrmb4Xw',
 'Desolation Row': '44Jg9GUybTrYKJJ2GkCKZs',
 'Dire Wolf': '7rLRoUv0PMTcHz0lOfpnti',
 "Doin' That Rag": '2Vq17hCbSPU3FQ9SzwOeJ3',
 "Don't Ease Me In": '6jzd25vDUfpbE6Z6KQnaD9',
 'Drums': '6FBaWnIUaQc5vFT1lLXvtE',
 "Dupree's Diamond Blues": '3RoNyMd48z90umgXHySso5',
 'Early Morning Rain': '4kNzxmqncoYhXSpqlEUZGu',
 'Easy Answers': '6u4Zys41QwaKXa2VSDKJyK',
 'Easy To Love You': '1U1TrxJf02fgheaVvyNU9A',
 'Easy Wind': '4n9pxaY7bTDMnw9biuCkhu',
 'El Paso': '0IJf70ScOcHAUEMa1JaAmE',
 'Empty Pages': '0NkRv6ooleBvQjxrMdj59x',
 'Estimated Prophet': '3DI8C3OSwuXd8E947MWiSi',
 'Eternity': '6FNsFYQaNhGFft3ZeLAF30',
 'Eyes Of The World': '1C4MVB7YoAkdQeJ0c47M86',
 'Far From Me': '1is0mzWtXiGrkMMdnizGEL',
 'Feedback': '5mFf4oruvbTzRgLvFxxzUo',
 'Feel Like A Stranger': '0w6YFfnIULlHktTKbdS484',
 'Fire On The Mountain': '0r9ZSCNXKinpOBUl943m3l',
 'Foolish Heart': '4kQaK6s8jSfvrCiXSX6bZU',
 "Franklin's Tower": '3PgIhd4XmwtmV2XGU5qhzZ',
 'Friend Of The Devil': '5ZLzl6T8JwqMTMdoE0nCbU',
 'From The Heart Of Me': '3tkgmcHPzK4tcHwscr6F9R',
 "Gimme Some Lovin'": '1bwEAzwmUyESRsVrp7zK9C',
 "Goin' Down The Road Feeling Bad": '3McI42RdYASgS0jigyagId',
 "Good Lovin'": '4rlVFpcNgQNEM43aHs5QaJ',
 "Good Lovin' Jam": '4rlVFpcNgQNEM43aHs5QaJ',
 "Good Morning Little Schoolgirl": '40ZadKqJuiO6TgFDWyAf8r',
 'Gotta Serve Somebody': '7BBg6ZpwfB1KVKEQehUbGl',
 'Greatest Story Ever Told': '2jbFswfjrScNOWJT4w6Jeo',
 'Hard To Handle': '34eaklDr2vqwS8L3LZvEB6',
 "He's Gone": '4SGS3okZJqz3GpEdruo9BK',
 'Hell In A Bucket': '2T2bhluy0slS4CZIMiAvYE',
 "Help On The Way": '6HpKnqlyos2ZeI9Bn2VrNW',
 'Here Comes Sunshine': '3zGUYyZVOrTv5s5CscuWQr',
 'Hey Jude': '3C9yOrmuu1JeJoQFDJF43o',
 'Hey Pocky Way': '2IYpHGDqL1zCPngQq8rrBa',
 'High Time': '5vmGZ4645Pyx1vHNBgFGDI',
 'How Sweet It Is (To Be Loved By You)': '67cV7gRThZHrvHTsDjwaHU',
 'I Know You Rider': '7tJjYDM3WxJpkasbVvk9X1',
 'I Need A Miracle': '3B7rdnhQLLcb3N0d6LNiEl',
 'I Want You': '4SCJH07MVCOOCxDkOF2xZG',
 'I Will Take You Home': '1Q3AmIjEbPYemA6UkjUUu0',
 "I'm A Hog For You Baby": '60NyTFrpUXgFjaXZFcUiuQ',
 "I'm A King Bee": '5sDaoTjIdF3GUZSsna8qbE',
 "I've Been All Around This World": '53j1w2RnkghE8X1O7u1VHS',
 'If I Had The World To Give': '1FRbyVnxScKgbKoTDQLC70',
 'Iko Iko': '4Xc7pLJ85QgaYzujEmrK8Y',
 "In The Midnight Hour": '1kV93xtKQW07t8dvzllbal',
 'It Hurts Me Too': "5zj8DvcQnA4leOjiqeDE8P",
 'It Must Have Been The Roses': '3lHYD0Eqkm2sTD792UCrUW',
 'It Takes A Lot To Laugh It Takes A Train To Cry': '0sHHFj3TiYNOFdnBkvIC0L',
 "It's A Man's World": '6J33rURaOEQhFgaIN7BJuz',
 "It's All Over Now": '0y6zeGEqNUw7aciYrdKA36',
 "It's All Over Now, Baby Blue": '099d6neHP7rGFM8l3pI1m3',
 'Jack A Roe': '3VfzGskNiyciPf5hBEcPmA',
 'Jack Straw': '0TtuYAtUBFlF3ylF57Qwyg',
 'Jam': '3uIpIwjGvpdn0CpWB7zxcS',
 'Joey': '2jlkCy1VD6Ha7AYUd85yjO',
 'Johnny B. Goode': '3lPTxkuBMtSYZVu9OBrdV1',
 'Just A Little Light': '1Pp0csZltf5jTrHcf9uh37',
 "Just Like Tom Thumb's Blues": '15DNn3OCugWLc5iJlR8SpY',
 'Katie Mae': '1lqgX9FgMJwmyRTyrL4aVb',
 'Keep Your Day Job': '2cXZlbsaU6ULa6qeA80AnP',
 "Knockin' On Heaven's Door": '7twSLcFrjjRD1oJ4qJS2G3',
 "Lazy Lightnin'": "27dMCZQgPC7eWNmBzsyhg8",
 "Lazy River Road": '6OuwGJNPuFlmUjGvok4cKT',
 "Let It Grow": '0shIpPqCIe7NVrub5frQW8',
 "Let Me Sing Your Blues Away": '3nWV4Uk4A3TlVHYxiHSnaF',
 "Let The Good Times Roll": '1WmN4vkX2HEyEsueSV4YgT',
 "Liberty": '2UkAIkfnDjn2WKFqvcTuE5',
 'Little Red Rooster': '3RpDzBtI8hfQAWjZ0klc1g',
 'Little Sadie': '1AnLG55oIgu542z7J1yPeu',
 'Long Black Limousine': '6eph55oL4a4MzKTHAZvqgz',
 'Looks Like Rain': '25tMAvFwYe3wmtw9rjSrej',
 'Loose Lucy': '2zRiNcLBVh0K6A1VL3zeg6',
 'Loser': '5jpq0glczrmrPuTdTkNFDG',
 'Lost Sailor': '0qrNPoIQamiHLx6GiVNDa6',
 "Maggie's Farm": '50Y6IplxnQd8YCaXAnkv0p',
 'Mama Tried': '6h7RCPkZvG7T4Rp02Xa0sE',
 "Man Of Peace": '2ApKvieGVfzJ03F6K9e6Wm',
 "Man Smart (Woman Smarter)": '63563VBd1HhC2TbJQdAdeb',
 "Mason's Children": '5Mf946iXBOx8DkiLOhbnkX',
 'Me And Bobby Mcgee': '0Fw197xHaLlChHaNYuHk9v',
 'Me And My Uncle': '2PcUp6JFJPfVqtIlaFcvNr',
 'Mexicali Blues': '3Feu20MBV8MREboccRzlj6',
 'Might As Well': '31sukrl1vSQxwrNTYDFHT8',
 'Mind Left Body Jam': '0Su99eA2yi9NKL0i5Bwj6I',
 'Mindbender': '1WKDtVsq7eDzOHmXKz7Mw8',
 'Mission In The Rain': '27Z2m2f5JMX3HWcoaJ1OEb',
 "Mississippi Half Step Uptown Toodeloo": '3AJnvtYWwYA431WxZg47RL',
 "Mona": '33OjPWJDjZzUiNgFYU9gMn',
 "Money Money": '2byjvCffZ8o5p6LHYlZIfd',
 "Monkey And The Engineer": '58Dc3Osn3EulmDBpMde1va',
 'Morning Dew': '4CGjzckFcKtWpuXgNqyBkp',
 'Mountains Of The Moon': '30hmtSeY9bpwEQPz8DWNjW',
 'Mr. Charlie': '7IrEbbIkEgs03Ke1KktWz0',
 'My Brother Esau': '0K7BxU73Bsh68SGGgurQO5',
 'Never Trust A Woman': '040r5gZK8Ub0PGOeinHKVI',
 'New Minglewood Blues': '27nasmd5S8eIvIkAa7wnSo',
 "New Potato Caboose": '0EiI4tM0j4Eah7Be7YYH5I',
 'New Speedway Boogie': '3YPBV5DacTbhgh7vharn6w',
 'Next Time You See Me': '5L7e86hsZbLz3z9o0C30wU',
 "Nobody's Fault But Mine": '0Vt8YbCRXVqdznXwTnBjwB',
 "Nobody's Fault But Mine Jam": '0Vt8YbCRXVqdznXwTnBjwB',
 "Not Fade Away": '49XFUxQEed7pDA1dXGEHbw',
 "Oh Babe It Ain't No Lie": '17OxLQl2U5MRfszHaHIPrq',
 "Oh Boy": '796lQ7G5GcdOHuWmk9DynQ',
 'Ollin Arrageed': '7F9yzH1pJRZIzxCixvYA3l',
 'On The Road Again': '3lUyunZMV5AX1fbT9EDGDo',
 'One Kind Favor': '3dpRrEzn03wNZ6LKLDa63E',
 'One More Saturday Night': '2I0fbTGgwFUUCopz7XpbjR',
 'Only A Fool': '7H5lXGNOsEujzSE0FgDWu8',
 'Operator': '1gv1jIEj20oPXhFDl7jyLS',
 'Passenger': '2cTgvRjVU6xnyhTWxXgMjP',
 'Peggy O': '1ONe7GKikYstl6ehkCP4Up',
 'Picasso Moon': '6r31K85IrTFa3RsclzPnBM',
 'Playing In The Band': '72smiccP7SlHMWxmi2twve',
 'Queen Jane Approximately': '4xznEr0amLu08ozCZUniTV',
 'Ramble On Rose': '24ei2BLeVEpGWLZ2qfLXJO',
 'Reuben And Cherise': '1g5gLvo1we4q9YzCbGJJte',
 'Ripple': '31Ch2wIS1T0ZTZf13XFvfs',
 'Rosalie Mcfall': '57QtIwdZ7USGRm2ULO0WIH',
 'Row Jimmy': '1m6rWZAK4vVLPbEGq59eT2',
 "Run Rudolph Run": "71nbVeAzuAKoitK6zOIFp3",
 "Sage And Spirit": '2ltJr7zvk7LhNLtkOCtf2i',
 'Saint Of Circumstance': '3T6fIfRCHL6ZbphnVHTain',
 "Saint Stephen": '63ZjH0NFN5q0ZT8fmmhHur',
 'Samba In The Rain': '4EIwO38pl8hmz0u9ccVdCd',
 'Samson And Delilah': '1r4TpmnDEOEW7HCcCVoErG',
 'Scarlet Begonias': '2ydjxozpSUZLzmi82KV4Qp',
 'Seastones': "4gLcOQpW0NVVxBD0WcFRJl",
 'Shakedown Street': "1lNRVjK8MukRZpeurYssIx",
 'She Belongs To Me': '5H22FWjtRCzUWTZ732hjPa',
 "She's Mine": '58dgevKnwdUSEY20zIZmFQ',
 "Ship Of Fools": '5ks4ht7EDua6UsaI4Dk7Lz',
 "Sick And Tired": '2bbfbvD7KRR0KX7e0jeiK1',
 'Sidewalks Of New York': '0p86DhNOEPxAk6PExB4ndm',
 'Silver Threads And Golden Needle': '4pahQIxDIXeBMpQx1BgLbu',
 'Sing Me Back Home': '5d6QD8979cl2LoovJ9CVG4',
 "Sittin' On Top Of The World": '2D35sD5gJvlJ3uionWdfEK',
 'Slipknot!': '1pBBzCX39kQivPXpTuD0ZU',
 "Slow Train": '6kpqaDEznzrlLFhPDwjNNY',
 "Smokestack Lightnin'": "1jCNcvh7X2l7JqWeiPfjYt",
 "Smokestack Lightnin' Jam": "1jCNcvh7X2l7JqWeiPfjYt",
 'So Many Roads': '7vf1HQsPEUHl4oxGt3Md1e',
 "Space": '15jK8JOtgxmA7bQffM93nO',
 "Spanish Jam": '5WbTlAnfJFrzJlO5I9fbqL',
 "Spoonful": '02riVr97rs2edH8yBHprPQ',
 'Stagger Lee': '3qeSluSBw76ajGqskpkg7a',
 'Standing On The Moon': '2KhNJ3rZ4NiWrxX2lAqZJN',
 'Stella Blue': '3yXTSJKglvmJYPYaQeyTSm',
 "Stronger Than Dirt Or Milkin' The Turkey": '4GirzGd1IYJYzEYKpLQDhV',
 "Stuck Inside Of Mobile With The Memphis Blues Again": '131vBeY6r6xk1SkAPgug41',
 "Sugar Magnolia": '5gxIn3miRFZBTVCWdDAxYd',
 "Sugaree": '32Qerv3fdQZGsoWhpqVRnT',
 "Sunrise": '12OvN3z8rQ9TVjYxGuZvDQ',
 "Sunshine Daydream": '53udsPEnk97RLBhc7fvHVC',
 "Supplication": '4ZBNVXnWbHCWMaoSZmuKmT',
 "Supplication Jam": '4ZBNVXnWbHCWMaoSZmuKmT',
 "Take A Step Back Tuning": '4ALz8WqR2gpXCl570xsf9F',
 "Tennessee Jed": '1ae0SQx8MpBXo6QsmrpsEj',
 "Terrapin Station": '2gdTkM0hL9KQipAx6aUT6L',
 "That Would Be Something": "3rZOYRFGmGXffzH5BfrqOJ",
 'The Ballad Of Casey Jones': '2oBG5uHI2zMwAXhK6jL6oN',
 "The Eleven": '2Ezia43Cm4DtUJhUZkbuFD',
 "The Eleven Jam": '2Ezia43Cm4DtUJhUZkbuFD',
 "The Last Time": '15DE3CnXQOhqjCPQW3IDNA',
 "The Main Ten Jam": '5W0QDIPUOlper5xQwKUecs',
 "The Mighty Quinn (Quinn The Eskimo)": '1KIeyiERXnyC4EspEqY5eE',
 "The Music Never Stopped": '4IqeKwiQgecYTCqzIa0mJb',
 "The Only Time Is Now": '0MooN42y4LINfcp54OfgKD',
 "The Other One": '5HyqkTD1AyfOqopIT4ybDf',
 'The Other One Jam': '5HyqkTD1AyfOqopIT4ybDf',
 'The Promised Land': '5qyHP14pcc5Pn1j6EXha3b',
 'The Race Is On': '4n6cB1WrllLjCkuafcGBLN',
 'The Rub': '1uMnkkqXDtdx04cYraYYZR',
 'The Same Thing': '58XeOYBgtqcEfNM2bioJdf',
 'The Weight': '5Oeel3hlSGzFkSuN36u4fr',
 'The Wheel': '0BvBCJOTQKEoYBAbzdx90l',
 'They Love Each Other': '4yL8wnrrF9xqzMmrudRQfl',
 'Throwing Stones': '4US41qlynueHuB4czgwqi8',
 'Till The Morning Comes': '2gws1v6aAT0mYxHVISMTph',
 'To Lay Me Down': '78rA4TEETpXZpuUzirG8zE',
 'Tom Dooley': '6fH9sNVCQAgYqQohSqpzLh',
 'Tomorrow Is Forever': '3hcpNNkSnhwJWGVhmDeZxV',
 'Tomorrow Never Knows': '7a4oFPjlN6lwDubHD9EOFb',
 'Tons Of Steel': '0LySJYHLVsptnmWaSKIzDi',
 'Touch Of Grey': '0mJQlCl9YgxW7kyeltNiVk',
 "Truckin'": '3Dwn5pJmruYXF7BoDFIhbB',
 'Turn On Your Lovelight': '4XO4pQpx4lpKgbWMgbsQRK',
 'Two Souls In Communion': '0SyiXMz3LPteTpA4QZpZ0t',
 "U.S. Blues": '2NiR9VOfASwOhgTnWs2cLx',
 'Unbroken Chain': '0QT7prPZzXJKBYMVdWlE1Z',
 "Uncle John's Band": '0kp728Knw5PYvU3QzMZ0yJ',
 "Uncle John's Band Jam": '0kp728Knw5PYvU3QzMZ0yJ',
 'Victim Or The Crime': '4xCdQSZgfxjeGAzcrDkDnx',
 'Viola Lee Blues': '6XHEjACwsfnsQn7oB1liZW',
 'Visions Of Johanna': '074jjKG0MIWCWj9uRIEeX5',
 'Wake Up Little Susie': '5MkmEeolckmJLnCiMI2bSR',
 "Walkin' Blues": '7a1MOaktp1TtkeJjAV4oKP',
 'Walking The Dog': '5VRmlpYsVczW9WXejmZMtW',
 'Wave That Flag': '7fklRRv4N3Dzi7PbfdXWdL',
 'Way To Go Home': '0PEpTN1h8VeBel26xYlBqV',
 'We Can Run': '3aH9IWlznsFHcTsJdG9MVS',
 'Weather Report Suite Part 1': '1x7FvHES9XSND7fB3XpQUh',
 'Weather Report Suite Prelude': '5yxCYNvqP1rw3xg2EiQxe7',
 'Werewolves Of London': '67TwsYor809kpcXDxWs0WC',
 'West L.A. Fadeaway': '54fM0nEnQJEBeU5YlqnRbE',
 'Wharf Rat': '2fpmfFA1UKOD7O1BydAqNw',
 "What's Become Of The Baby": '7lUZKiF7DMVdZGbzONUxtx',
 'When I Paint My Masterpiece': '79OjlizAFXwarVI8xQoVNp',
 'When Push Comes To Shove': '2ZDgmKOcG4H2ipXUQoffRi',
 'Who Do You Love?': '5LR5PkO6Qiiret2YtySSp0',
 'Yellow Dog Story': '6Cjkm9aTinrkDxj8LnqKeG',
 'You See A Broken Heart': '4RTvKn177qmQW1rd0gqwuO',
 'You Win Again': '2UdeTflun7YLrJOVRMtlNG'
}