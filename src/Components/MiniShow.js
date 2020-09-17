import React from 'react'

class MiniShow extends React.Component {

    render() {

        return(
            <>
            <h5>{this.props.showObj.venue}, {this.props.showObj.city}, {this.props.showObj.state} - {this.props.showObj.month}/{this.props.showObj.day}/{this.props.showObj.year}</h5>
                    <p >{this.props.showObj.uuid}</p> 
            </>
        )
    }



}

export default MiniShow