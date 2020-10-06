import React from 'react'
import {withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Container from 'react-bootstrap/Container'
import Animation from './Animation/Animation'


class LoginForm extends React.Component {

    state = {
        username: "",
        password: ""
    }

    //controlled form changes state as user enters information
    changeHelper = (e) => {
        this.setState({...this.state, [e.target.name]:e.target.value })
    }

    //submits login credentials to app component for verification
    submitHelper = (e) => {
        e.preventDefault()
        this.props.loginHandler(this.state)
    }

    //takes user to create user component
    goToSignup = () => {
        this.props.history.push("/createuser")
    }



    render() {
        return(
            <>
            <Animation />
            <div className="cbox">
                
            <Container className="credentials">
                    <h3 >Log In:</h3>
                
                    <Form onSubmit={this.submitHelper}>
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control name='username' type="text" placeholder="Enter username" value={this.state.username} onChange={this.changeHelper} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control name='password' type="password" placeholder="Password" value={this.state.password} onChange={this.changeHelper} />
                        </Form.Group>
                            <Form.Text className="text-muted">
                                Don't have an Account?
                            </Form.Text>
                            <div className="lesbuttons">

                                <ButtonToolbar >
                                    <ButtonGroup>
                                        <Button variant="primary" type="submit">
                                            Log in
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button variant="secondary" onClick={this.goToSignup}>
                                            Sign Up Here
                                        </Button>
                                    </ButtonGroup>

                                </ButtonToolbar>
                            </div>
                    </Form>
                {/* </Row>
                <Row> */}

               
            </Container>

            </div>
            </>
        )
    }

}

export default withRouter(LoginForm)