import React from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'

class SearchFilter extends React.Component{

    state = {
        searchTerm: "",
        clear: false
    }

    changeHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler = (e) => {
        this.props.searchChange(this.state.searchTerm, e.target.textContent)
        this.setState({
            searchTerm: "",
            clear: !this.state.clear
        })
    }

    render(){
        return(
            <div className='searchbois'>
                
                <Form inline className='lilfilters'>
                    <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                      <strong>Sort By:</strong>
                    </Form.Label>
                    <Form.Control
                        as="select"
                        className="my-1 mr-sm-2"
                        id="inlineFormCustomSelectPref"
                        custom
                        onChange={this.props.filterChange}
                    >
                        <option value="oldest">Oldest</option>
                        <option value="recent">Recent</option>
                    </Form.Control>
                    <InputGroup  className='lilfilters'>
                        <FormControl
                        placeholder="Search by Venue, City or Year"
                        aria-label="Search"
                        aria-describedby="basic-addon2"
                        name='searchTerm'
                        value={this.state.searchTerm}
                        onChange={this.changeHandler}
                        />
                        <InputGroup.Append>
                        {this.state.clear ?
                        <Button onClick={this.submitHandler} variant="secondary">Reset</Button>
                        :
                        <Button onClick={this.submitHandler} variant="primary">Search</Button>
                        }
                        </InputGroup.Append>
                    </InputGroup>
                    </Form>
            </div>
        )
    }

}

export default SearchFilter