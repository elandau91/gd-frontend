import React from 'react'


class ShowShow extends React.Component {

    state = {
        featuredShow: null
    }


    componentDidMount() {
        fetch(`http://localhost:3000/shows/${this.props.showObj.uuid}`)
        .then(res => res.json())
        .then(showFetch => {
            console.log(showFetch)
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
                <h1>Show Page</h1>
                <h3>{this.state.featuredShow.venue}, {this.state.featuredShow.city}, {this.state.featuredShow.state} - {this.state.featuredShow.day}/{this.state.featuredShow.month}/{this.state.featuredShow.year}</h3>
                <ul>
                    {this.state.featuredShow.song_refs.map(song => {
                        return(
                            <li>{song.name}</li>
                        )
                    })}
                </ul>


                </>
            }

            </>
        )
    }

}

export default ShowShow