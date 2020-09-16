import React from 'react'
import ShowShow from '../Components/ShowShow'


class MainContainer extends React.Component {

    state = {
        topShows: [],
        feature: null
      }
      
      componentDidMount() {
        fetch('http://localhost:3000/shows')
        .then(res => res.json())
        .then(shows => {
          let newShows = shows.sort(() => Math.random() - Math.random()).slice(0, 5)
          this.setState({
            topShows: newShows
          })
        })
      }

      renderShow = (show) => {
        console.log(show)
        
        this.setState({
            feature: show
        })
      }


    render() {
        return(
            <>
            {
                this.state.feature === null ? 
                <>
                <h1>Hi, here are some shows:</h1>
                    {this.state.topShows.map(show => {
                    return (
                        <>
                        <h3>{show.venue}, {show.city}, {show.state} - {show.day}/{show.month}/{show.year}</h3>
                    {/* <p >{show.uuid}</p> */}
                    <p onClick={() => this.renderShow(show)}>{show.uuid}</p>
                            <br></br>
                        </>
                    )
                    })}
                </>
            :
                <>
                    <ShowShow showObj={this.state.feature} />
                </>
            }

            </>
        )
    }

}

export default MainContainer