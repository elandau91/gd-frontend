import React from 'react'


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
        // console.log(this.state.featuredShow)
        return(
            <>
            {
                this.state.featuredShow === null ?
                <h1>loading!</h1>
            :   

                <>
                <h1 class='test' >Show Page</h1>
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