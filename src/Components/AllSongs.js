import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import PlayWidget from 'react-spotify-widgets';
import SvgDeadditBlueLogomark from '../Icons/DeadditBlueLogomark'
import Spinner from 'react-bootstrap/Spinner'
import SvgDeadditMultiLogomark from '../Icons/DeadditMultiLogomark'

    

class AllSongs extends React.Component{
    
    state = {
        allSongs: [],
        searchSongs: [],
        songURI: null,
        songShow: null,
    }

    changeHandler = (e) => {
        let newSearch = this.state.allSongs.filter(song => {return song.name.toLowerCase().includes(e.target.value.toLowerCase())})
        this.setState({searchSongs: newSearch})
    }

    componentDidMount() {
        fetch('https://deaditt-backend.herokuapp.com/api/v1/song_refs')
        .then(res => res.json())
        .then(songs=> {
           let sorted = songs.sort(function(a, b) {
                let textA = a.name
                let textB = b.name
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            this.setState({allSongs: sorted})
        })
    }

    songSelect = (clickedSong) => {
        

        let songChoice
        
        for (const key in songCatalog) {
            if (key === clickedSong.name) {
                songChoice = songCatalog[key]
            }
        }

        this.setState({
            songURI: songChoice,
            songShow: clickedSong
        })
    }

    clearSelection = (e) => {
        this.setState({
            songURI: null,
            songShow: null
        })
    }

    filterChange = (e) => {
        
        if (e.target.value === "most") {
            let sorted = this.state.allSongs.sort(function(a, b) {
                let textA = a.song_occurences_count
                let textB = b.song_occurences_count
                return (textB < textA) ? -1 : (textB > textA) ? 1 : 0;
            });
            this.setState({
                allSongs: sorted,
            })
        } else if (e.target.value === "least") {
                let sorted = this.state.allSongs.sort(function(a, b) {
                    let textA = a.song_occurences_count
                    let textB = b.song_occurences_count
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                this.setState({
                    allSongs: sorted,
                })
        } else if (e.target.value === "a") {
            let sorted = this.state.allSongs.sort(function(a, b) {
                let textA = a.name
                let textB = b.name
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            this.setState({allSongs: sorted})
        } else {
            let sorted = this.state.allSongs.sort(function(a, b) {
                let textA = a.name
                let textB = b.name
                return (textB < textA) ? -1 : (textB > textA) ? 1 : 0;
            });
            this.setState({allSongs: sorted})
        }
    }

    render() {
        const headerClass = ['border-gray border-right'].join(' ').trim();
        return (
            
            <>
            {this.state.allSongs.length === 0 ? 
                <div className='loading'>
                    <Spinner className='spinner' animation="grow" role="status">
                        <SvgDeadditMultiLogomark height='200px' width='200px'/>
                    </Spinner>
                </div>
            :
                <>
            <div className='littleboard'>
                    

                <div className="currentpage">
                        <h2 style={{color: "white"}} className={headerClass}>
                            {this.state.searchSongs.length > 0 ?
                                <strong>{this.state.searchSongs.length} Songs</strong> 
                            :
                                <strong>{this.state.allSongs.length} Songs</strong> 
                            }
                            &nbsp;
                            &nbsp;
                        </h2>
                </div>
                <span className="current-page d-inline-block h-100 pl-4 text-secondary "></span>
                <div className='songfilters'>
                
                <Form inline className='lilfilters'>
                    <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                      <span><strong>Sort By:</strong></span>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        className="my-1 mr-sm-2"
                        id="inlineFormCustomSelectPref"
                        custom
                        onChange={this.filterChange}
                    >
                        <option value="a">A - Z</option>
                        <option value="z">Z - A</option>
                        <option value="most">Most Played</option>
                        <option value="least">Least Played</option>
                    </Form.Control>
                    <InputGroup  className='lilfilters'>
                        <FormControl
                        placeholder="Start Typing Song Name"
                        aria-label="Search"
                        aria-describedby="basic-addon2"
                        name='searchTerm'
                        width='80px'
                        // value={this.state.searchTerm}
                        onChange={this.changeHandler}
                        />
                        
                        
                    </InputGroup>
                    </Form>
                </div>
            </div>

            <div className='songslist'>
                        {this.state.searchSongs.length > 0 ?
                        this.state.searchSongs.map((song, index) => {
                            
                            return (
                                

                        
                                <ListGroup key={index} horizontal>
                                {
                                this.state.songShow === null ?
                                    <>
                                    <ListGroup.Item action variant="light"  >

                                    <h5 className='title'>{song.name}</h5>
                                    <SvgDeadditBlueLogomark onClick={() => this.songSelect(song)}  className="likes"/>  
                                        
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>Click Stealie For More!</ListGroup.Item>
                                    </>
                                
                                :
                                this.state.songShow.uuid === song.uuid ?
                                <>
                                    <ListGroup.Item action variant="light"  >

                                    <h5 className='title'>{song.name}</h5>
                                    <span>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <PlayWidget
                                    width={300}
                                    height={80}
                                    uri={`spotify:track:${this.state.songURI}`}
                                    /> 
                                    </span>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <h5 className='playcount'>{song.name} has been played live {song.song_occurences_count} times</h5>
                                    <SvgDeadditMultiLogomark onClick={this.clearSelection}  className="likes"/>  
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>Click Stealie For List</ListGroup.Item>
                                </>
                                :
                                <>
                                    <ListGroup.Item action variant="light"  >

                                    <h5 className='title'>{song.name}</h5>
                                    
                                    <SvgDeadditBlueLogomark onClick={() => this.songSelect(song)}  className="likes"/>  
                                        
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>Click Stealie For More!</ListGroup.Item>
                                </>
                                }
                                </ListGroup>
                                    
                               
                               )
                            }
                            )
                            
                        :
                        this.state.allSongs.map((song, index) => {
                            
                            return (
                                
                                <ListGroup key={index} horizontal>
                                {
                                this.state.songShow === null ?
                                    <>
                                    <ListGroup.Item action variant="light"  >

                                    <h5 className='title'>{song.name}</h5>
                                    <SvgDeadditBlueLogomark onClick={() => this.songSelect(song)}  className="likes"/>  
                                        
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>Click Stealie For More!</ListGroup.Item>
                                    </>
                                
                                :
                                this.state.songShow.uuid === song.uuid ?
                                <>
                                    <ListGroup.Item action variant="light"  >

                                    <h5 className='title'>{song.name}</h5>
                                    <span>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <PlayWidget
                                    width={300}
                                    height={80}
                                    uri={`spotify:track:${this.state.songURI}`}
                                    /> 
                                    </span>
                                    &nbsp;
                                    &nbsp;
                                    &nbsp;
                                    <h5 className='playcount'>{song.name} has been played live {song.song_occurences_count} times</h5>
                                    <SvgDeadditMultiLogomark onClick={this.clearSelection}  className="likes"/>  
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>Click Stealie For List</ListGroup.Item>
                                </>
                                :
                                <>
                                    <ListGroup.Item action variant="light"  >

                                    <h5 className='title'>{song.name}</h5>
                                    
                                    <SvgDeadditBlueLogomark onClick={() => this.songSelect(song)}  className="likes"/>  
                                        
                                    </ListGroup.Item>
                                    
                                    <ListGroup.Item>Click Stealie For More!</ListGroup.Item>
                                </>
                                }
                                </ListGroup>
                                    
                               
                               )
                            })
                    
                    }   
                    </div>     
                </>
            }
          </>
        );
      }
}

export default AllSongs

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