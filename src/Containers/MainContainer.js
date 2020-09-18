import React from 'react'
import {withRouter, Link} from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import MiniShow from '../Components/MiniShow'
import Pagination from '../Components/Pagination'

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

    //   renderShow = (show) => {
        
        
    //     this.setState({
    //         feature: show
    //     }, () => this.props.history.push(`/home/${this.state.feature.uuid}`))
    //   }

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

        if (totalShows === 0) return null;

        return(
            <>
                
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

                    <Pagination className="pagination" totalRecords={totalShows} pageLimit={30} pageNeighbours={2} onPageChanged={this.onPageChanged} />
                    <ListGroup>

                        {currentShows.map((show, index) => {
                            return (
                               <Link key={index}  style={{ textDecoration: 'none' }} to={`/shows/${show.uuid}`}>
                                    <ListGroup.Item 
                                    onClick={() => this.props.renderShow(show)}
                                    >
                                    
                                        <MiniShow  showObj={show} />
                                    
                                    </ListGroup.Item>
                               </Link> 
                        
                            )
                        })}
                    </ListGroup>
                </>
                {/* {this.state.feature === null ? 
                    null
                :
                    <> 
                            <Route path={`/home/${this.state.feature.uuid}`} render={() => console.log(this.state.feature)}/>
                       
                    </>
                }  */}

            </>
        )
    }

}

export default withRouter(MainContainer)