import React from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Container from 'react-bootstrap/Container'
import Animation from './Animation/Animation'


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
            <Animation />
            <div className='cbox'>
                <Container className="credentials">
                    <h3>Sign Up:</h3>
                    
                        <Form onSubmit={this.submitHelper}>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Create Username</Form.Label>
                                <Form.Control name='username' type="text" placeholder="Enter username" value={this.state.username} onChange={this.changeHelper} />
                                <Form.Text className="text-muted">
                                    Remember to create a unique username!
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Create Password</Form.Label>
                                <Form.Control name='password' type="password" placeholder="Enter password" value={this.state.password} onChange={this.changeHelper} />
                            </Form.Group>
                            <Form.Group controlId="formBasicAvatar">
                                <Form.Label>Create Avatar</Form.Label>
                                <Form.Control name='avatar' type="text" placeholder="Enter IMG URL" value={this.state.avatar} onChange={this.changeHelper} />
                            </Form.Group>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Enter Email</Form.Label>
                                <Form.Control name='email' type="text" placeholder="Enter email" value={this.state.email} onChange={this.changeHelper} />
                            </Form.Group>
                            <Form.Text className="text-muted">
                                Already a User?
                            </Form.Text>
                            <div className="lesbuttons">

                                <ButtonToolbar >
                                    <ButtonGroup>
                                        <Button variant="primary" type="submit">
                                            Sign Up
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup>
                                        <Button variant="secondary" onClick={this.goToLogin}>
                                            Login Here
                                        </Button>
                                    </ButtonGroup>

                                </ButtonToolbar>
                            </div>
                        </Form>
                    
                </Container>
            </div>
            </>
        )
    }

}

export default withRouter(SignupForm)