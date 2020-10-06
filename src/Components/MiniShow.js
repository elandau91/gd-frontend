import React from 'react'
import {Link} from 'react-router-dom'
import SvgDeadditBlackLogomark from '../Icons/DeadditBlackLogomark'
import SvgDeadditMultiLogomark from '../Icons/DeadditMultiLogomark'

class MiniShow extends React.Component {

    
    render() {
        let faveShow = this.props.currentUser.fave_shows.find(fave_show => {
            return fave_show.show_id === this.props.showObj.uuid
        })

        
        
        return(
            <>
            <Link style={{ textDecoration: 'none' }} to={`/shows/${this.props.showObj.uuid}`} onClick={() => this.props.renderShow(this.props.showObj)}>
                <h5 className="title">{this.props.showObj.venue}, {this.props.showObj.city}, {this.props.showObj.state === "" ? this.props.showObj.country : this.props.showObj.state } - {this.props.showObj.month}/{this.props.showObj.day}/{this.props.showObj.year}</h5>
            </ Link>
           


            {faveShow ? 
            <SvgDeadditMultiLogomark onClick={() => this.props.deleteFavorite(faveShow)} className="likes"/>
            :
            <SvgDeadditBlackLogomark onClick={() => this.props.postFavorite(this.props.showObj.uuid)} className="likes"/>
            }
            </>
        )
    }



}

export default MiniShow