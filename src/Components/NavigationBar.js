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
        
        <ul>
            {props.currentUser ? 
            
                <>
                    {/* <li>Logo</li>   

                    <a onClick={props.clearUser} > 
                        <li>Log Out</li>
                    </a> */}
                
                    {/* <NavLink to={`/user/${props.currentUser.id}`}>
                        <li>Profile</li>
                    </NavLink> */}

                    <Navbar fixed="top" bg="light" variant="light">
                            <NavLink className='navguys' to="/shows"><SvgDeadditMultiLockup width="100px" height="50px" /></NavLink>
                            <Nav className="mr-auto">
                            <NavLink style={{ textDecoration: 'none' }} className='navguys' to="/shows">Home</NavLink>
                            <NavLink style={{ textDecoration: 'none' }} className='navguys' to={`/profile/${props.currentUser.id}`}>Profile</NavLink>
                            <NavLink style={{ textDecoration: 'none' }} className='navguys' to="/users">All Users</NavLink>
                            <NavLink style={{ textDecoration: 'none' }} onClick={props.clearUser} className='navguys' to="#pricing">Logout</NavLink>
                            </Nav>
                            <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-info">Search</Button>
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

        </ul>
    )

}

export default withRouter(NavigationBar)