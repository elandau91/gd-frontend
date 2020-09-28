import React from 'react'
import {withRouter, NavLink} from 'react-router-dom'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import SvgDeadditMultiLockup from '../Icons/DeadditMultiLockup'



class NavigationBar extends React.Component {

    state = {
        searchTerm: "",
        clear: false
    }

    searchHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler = (e) => {
        e.preventDefault()
        this.props.searchForUser(this.state.searchTerm)
        this.setState({searchTerm: "", clear: !this.state.clear})
    }

    render() {

        return (
            
            <>
                {this.props.currentUser ? 
                
                    <>
    
                        <Navbar fixed="top" bg="light" variant="light" className='lenav'>
                                <NavLink className='navguys' to="/shows"><SvgDeadditMultiLockup width="100px" height="50px" /></NavLink>
                                <Nav className="mr-auto">
                                <NavLink style={{ textDecoration: 'none', color: "black" }} className='navguys' to="/shows">Home</NavLink>
                                <NavLink style={{ textDecoration: 'none', color: "black"  }} className='navguys' to={`/users/${this.props.currentUser.id}`}>Profile</NavLink>
                                <NavLink style={{ textDecoration: 'none', color: "black"  }} className='navguys' to="/users">All Users</NavLink>
                                <NavLink style={{ textDecoration: 'none', color: "black"  }} className='navguys' to="/songs">Songs</NavLink>
                                <NavLink style={{ textDecoration: 'none', color: "black"  }} onClick={this.props.clearUser} className='navguys' to="#pricing">Logout</NavLink>
                                </Nav>
                                    <Form inline >
                                    <FormControl value={this.state.searchTerm} onChange={this.searchHandler} name="searchTerm" type="text" placeholder="Search Users" className="mr-sm-2" />
                                {this.state.clear ?  
                                    <Button onClick={this.submitHandler} variant="outline-secondary">Reset Search</Button>
                                :
                                    <Button onClick={this.submitHandler} variant="outline-primary">Search Users</Button>
                                }
                                </Form>
                            </Navbar>
    
                        
                    </>
                :   
                        <>
                           <Navbar fixed="top" bg="light" variant="light">
                                <Navbar.Brand href="/"><SvgDeadditMultiLockup width="100px" height="50px" /></Navbar.Brand>
                                <Nav className="mr-auto">
                                </Nav>
            
                            </Navbar>
                        
                               
                        </>
                }
    
            </>
        )
    }

}

export default withRouter(NavigationBar)