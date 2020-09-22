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
        // feature: null
      }
      
      componentDidMount() {
        fetch('http://localhost:3000/api/v1/shows')
        .then(res => res.json())
        .then(shows => {
          this.setState({
            allShows: shows
          })
        })
      }


      onPageChanged = (data) => {
          
        const { allShows } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
        const offset = (currentPage - 1) * pageLimit;
        const currentShows = allShows.slice(offset, offset + pageLimit);
    
        this.setState({ currentPage, currentShows, totalPages });
      }


    render() {
        const { allShows, currentShows, currentPage, totalPages } = this.state;
        const totalShows = allShows.length;
        const headerClass = ['text-dark py-2 pr-4 m-0', currentPage ? 'border-gray border-right' : ''].join(' ').trim();

        // if (totalShows === 0) return null;
        
        
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
                
                    <div className="headers">
                        <h2 className={headerClass}>
                        <strong className="text-secondary">{totalShows}</strong> Shows
                        </h2>
                    </div>
                    <div className="currentpage">

                        { currentPage && (
                            <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                        Page <span className="font-weight-bold">{ currentPage }</span> / <span className="font-weight-bold">{ totalPages }</span>
                        </span>
                    ) }
                    </div>
                    
                    {/* <SearchFilter className='searchboi' /> */}
                    <Pagination className="pagination" totalRecords={totalShows} pageLimit={30} pageNeighbours={2} onPageChanged={this.onPageChanged} />

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
                </>
            }
            </>
        )
    }

}

export default withRouter(MainContainer)