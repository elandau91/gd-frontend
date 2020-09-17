import React from 'react'
import {withRouter } from 'react-router-dom'
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
                            <Navbar.Brand href="/home"><SvgDeadditMultiLockup width="80px" height="40px" /></Navbar.Brand>
                            <Nav className="mr-auto">
                            <Nav.Link href="/home">Home</Nav.Link>
                            <Nav.Link href={`/user/${props.currentUser.id}`}>Profile</Nav.Link>
                            <Nav.Link onClick={props.clearUser} href="#pricing">Logout</Nav.Link>
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
                            <Navbar.Brand href="#home"><SvgDeadditMultiLockup width="80px" height="40px" /></Navbar.Brand>
                            <Nav className="mr-auto">
                            </Nav>
        
                        </Navbar>
                    
                           
                    </>
            }

        </ul>
    )

}

export default withRouter(NavigationBar)