import React from 'react'
import {withRouter, NavLink} from 'react-router-dom'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import SvgDeadditMultiLockup from '../Icons/DeadditMultiLockup'



function NavigationBar(props) {
    return (
        
        <>
            {props.currentUser ? 
            
                <>

                    <Navbar fixed="top" bg="light" variant="light" className='lenav'>
                            <NavLink className='navguys' to="/shows"><SvgDeadditMultiLockup width="100px" height="50px" /></NavLink>
                            <Nav className="mr-auto">
                            <NavLink style={{ textDecoration: 'none', color: "black" }} className='navguys' to="/shows">Home</NavLink>
                            <NavLink style={{ textDecoration: 'none', color: "black"  }} className='navguys' to={`/users/${props.currentUser.id}`}>Profile</NavLink>
                            <NavLink style={{ textDecoration: 'none', color: "black"  }} className='navguys' to="/users">All Users</NavLink>
                            <NavLink style={{ textDecoration: 'none', color: "black"  }} onClick={props.clearUser} className='navguys' to="#pricing">Logout</NavLink>
                            </Nav>
                            <Form inline>
                            <FormControl type="text" placeholder="Search Users" className="mr-sm-2" />
                            <Button variant="outline-info">Search Users</Button>
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

export default withRouter(NavigationBar)