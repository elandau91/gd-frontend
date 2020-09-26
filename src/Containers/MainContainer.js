import React from 'react'
import {withRouter} from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import MiniShow from '../Components/MiniShow'
import Pagination from '../Components/Pagination'
import SearchFilter from '../Components/SearchFilter'
import Spinner from 'react-bootstrap/Spinner'
import SvgDeadditMultiLogomark from '../Icons/DeadditMultiLogomark'

class MainContainer extends React.Component {

    state = {
        allShows: [],
        currentShows: [],
        currentPage: null,
        totalPages: null,
        searchShows: []
      }
      
      componentDidMount() {
        let sortedShows = []
        fetch('http://localhost:3000/api/v1/shows')
        .then(res => res.json())
        .then(shows => {
          sortedShows = this.leSort(shows)
           this.setState({
            allShows: sortedShows
          })
        })
      }

      minTwoDigits = (n) => {
          //console.log("number", n, "length", n.length)
        return (n.length === 1 || (n.length === undefined && n < 10) ? '0' : '') + n;
      }

      leSort = (shows) => {
          return shows.sort((a, b) => {
                a.month = this.minTwoDigits(a.month)
                a.day = this.minTwoDigits(a.day)
                b.month = this.minTwoDigits(b.month)
                b.day = this.minTwoDigits(b.day)
           
            return parseInt(a.year + a.month + a.day) - parseInt(b.year + b.month + b.day)
              })
          
      }


      onPageChanged = (data) => {
          
        const { allShows } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const currentShows = allShows.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentShows, totalPages });
      }

      filterChange = (e) => {  
        let newShows = this.state.allShows.reverse()
        let newCurrentShows = newShows.slice(0, 0 + 30);
        this.setState({
            allShows: newShows,
            currentShows: newCurrentShows
        })
      }

      searchChange = (searchTerm, innerValue) => {
       //console.log(this.state.searchShows)
       
       let year = this.state.allShows.filter(show => show.year === parseInt(searchTerm))
       
        if (innerValue=== "Reset") {
            //console.log("nada")
            this.setState({searchShows: []})
        } 
        else if (year.length > 0) {
            //console.log("year")
            let newSearch = this.state.allShows.filter(show => {
                return show.year === parseInt(searchTerm)
            })
            
            this.setState({searchShows: newSearch})
        }
        else {
            //console.log("venue")
            let newSearch = this.state.allShows.filter(show => {
                 return show.venue.toLowerCase().includes(searchTerm.toLowerCase()) || show.city.toLowerCase().includes(searchTerm.toLowerCase())
            })   
            this.setState({searchShows: newSearch})
        }

      }


    render() {
        
        const { allShows, currentShows, currentPage, totalPages } = this.state;
        const totalShows = allShows.length;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

        // if (totalShows === 0) return null;
        // console.log(this.state.searchShows.length)
        // console.log(this.state.searchShows)
        
        return(
            <>
                {totalShows === 0 ? 
                <div className='loading'>
                    <Spinner className='spinner' animation="grow" role="status">
                        <SvgDeadditMultiLogomark height='200px' width='200px'/>
                    </Spinner>
                </div>
                :
                <>
                    <div className="bigboard" >

                    <div className="searchbois">

                    <div className="currentpage">
                        <h2 style={{color: "white"}} className={headerClass}>
                        <strong >
                            {this.state.searchShows.length >= 1 ?
                                this.state.searchShows.length 
                            :
                                totalShows 
                            }
                         &nbsp;Shows
                        </strong> 
                        </h2>
                    </div>
                    <div className="currentpage">

                        { currentPage && (
                            <span className="current-page d-inline-block h-100 pl-4 text-secondary ">
                        <strong>Page </strong><span className="font-weight-bold">{ currentPage }</span><strong style={{color: "white"}}> / </strong><span className="font-weight-bold">
                                {this.state.searchShows.length >= 1 ?
                                    1
                                :
                                    totalPages 
                                }
                            </span>
                        </span>
                    ) }
                    </div>
                    </div>
                    
                    <SearchFilter className="searchbois" filterChange={this.filterChange} searchChange={this.searchChange}/>
                    <Pagination disabled className="searchbois" totalRecords={totalShows} pageLimit={30} pageNeighbours={2} onPageChanged={this.onPageChanged} />
                    
                    </div>
                        {this.state.searchShows.length >= 1 ? 
                        <div className="showslist">
                            {this.state.searchShows.map((show, index) => {
                                return (
                                    <ListGroup horizontal key={index}>
                                    
                                        <ListGroup.Item action variant="light" >
                                            
                                            <MiniShow showObj={show} deleteFavorite={this.props.deleteFavorite} postFavorite={this.props.postFavorite} renderShow={this.props.renderShow} currentUser={this.props.currentUser}/>
                                            
                                        </ListGroup.Item>
                                        {this.props.currentUser.fave_shows.find(fave => {return fave.show_id === show.uuid}) ?

                                        <ListGroup.Item>Click Stealie to Unlike</ListGroup.Item>
                                        :
                                        <ListGroup.Item>Click Stealie to Like!!</ListGroup.Item>
                                        }
                                
                                    </ListGroup>
                                )
                            })}
                        </div>
                        :
                        <div className="showslist">
                            {currentShows.map((show, index) => {
                                return (
                                    <ListGroup horizontal key={index}>
                                    
                                        <ListGroup.Item action variant="light" >
                                            
                                            <MiniShow showObj={show} deleteFavorite={this.props.deleteFavorite} postFavorite={this.props.postFavorite} renderShow={this.props.renderShow} currentUser={this.props.currentUser}/>
                                            
                                        </ListGroup.Item>
                                        {this.props.currentUser.fave_shows.find(fave => {return fave.show_id === show.uuid}) ?

                                        <ListGroup.Item>Click Stealie to Unlike</ListGroup.Item>
                                        :
                                        <ListGroup.Item>Click Stealie to Like!!</ListGroup.Item>
                                        }
                                
                                    </ListGroup>
                                )
                            })}
                        </div>
                        }
                </>
            }
            </>
        )
    }

}

export default withRouter(MainContainer)