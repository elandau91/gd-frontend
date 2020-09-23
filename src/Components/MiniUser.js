import React from 'react'
import {Link} from 'react-router-dom'
import SvgDeadditBlackLogomark from '../Icons/DeadditBlackLogomark'
import SvgDeadditMultiLogomark from '../Icons/DeadditMultiLogomark'
import SvgDeadditRedLogomark from '../Icons/DeadditRedLogomark'

class MiniUser extends React.Component {

    render() {
        let following = this.props.currentUser.followees.find(followee => {
            return followee.id === this.props.userObj.id
        })
        
        
        return(
            <>
            <Link style={{ textDecoration: 'none' }}
             to={`/users/${this.props.userObj.id}`} 
             onClick={() => this.props.renderUser(this.props.userObj)}>
                <h5 className="title" >{this.props.userObj.username}</h5>
            </ Link>
           


            {this.props.currentUser.id === this.props.userObj.id ?
            <SvgDeadditRedLogomark onClick={() => this.props.renderUser(this.props.userObj)} className="likes"/>
            :
            following ? 
            <SvgDeadditMultiLogomark onClick={() => this.props.unfollowUser(following)}  className="likes"/>
            :
            <SvgDeadditBlackLogomark onClick={() => this.props.followUser(this.props.userObj.id)} className="likes"/>
            }
            </>
        )
    }



}

export default MiniUser