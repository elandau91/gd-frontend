import React from 'react'

import PlayWidget from 'react-spotify-widgets';


    

class Test extends React.Component{
    
    state = {
        song: null
    }

    songSelect = (e) => {
        console.log(songCatalog)

        let songChoice
        
        for (const key in songCatalog) {
            if (key === e.target.textContent) {
                songChoice = songCatalog[key]
            }
        }

        this.setState({
            song: songChoice
        })

        // console.log(songChoice)

        //let songChoice = songCatalog.find(song => song === e.target.textContent)
        //console.log(songChoice)
    }

    render() {
        return (
            <div className='test'>
                {this.state.song ? 
                    <PlayWidget
                    width={300}
                    height={380}
                    uri={`spotify:track:${this.state.song}`}
                    lightTheme={true}
                    />
                :
                <>
                    <button onClick={this.songSelect}>Deal</button>
                    <button onClick={this.songSelect}>Estimated Prophet</button>
                </>
                }

          </div>
        );
      }
}

export default Test

const songCatalog = {
    "Deal": '6N5GmiDGcbPJQE4mYWpJom',
    "Estimated Prophet": '1reRa8uwqquOON1O7RgrIL'
}