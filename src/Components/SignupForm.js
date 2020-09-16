import React from 'react'
import { withRouter } from 'react-router-dom'


class SignupForm extends React.Component {

    state = {
        username: "",
        password: "",
        email: "",
        avatar: ""
    }

    changeHelper = (e) => {
        this.setState({...this.state, [e.target.name]:e.target.value })
    }

    submitHelper = (e) => {
        e.preventDefault()
        this.props.createHandler(this.state)
    }

    goToLogin = () => {
        this.props.history.push("/")
    }

    render() {
        return(
            <>
                <h6 class='test'>Sign Up:</h6>
                <form onSubmit={this.submitHelper}>
                    <input name="username" type="text" placeholder="Enter Username" value={this.state.username} onChange={this.changeHelper} />
                    <input name="password" type="password" placeholder="Enter Password" value={this.state.password} onChange={this.changeHelper} />
                    <input name="email" type="text" placeholder="Enter Email" value={this.state.email} onChange={this.changeHelper} />
                    <input name="avatar" type="text" placeholder="Enter IMG URL" value={this.state.avatar} onChange={this.changeHelper} />
                    <input type="submit" value="Sign Up"/>
                </form>
        
                <p>Already a user?</p>
                <button onClick={this.goToLogin}>Login Here</button> 
            </>
        )
    }

}

export default withRouter(SignupForm)