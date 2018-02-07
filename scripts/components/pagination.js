import React, { Component } from 'react';

export default class Pagination extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstPage: 1,
      currentPage: 1,
      maxPage: Math.ceil(this.props.numEntries/this.props.entriesPerPage),
      minPage: 1
    };
  }

  previousPage() {
    if(this.state.firstPage != this.state.currentPage) {
      this.setState({ currentPage: this.state.currentPage-1 });
      this.props.updatePage(this.state.currentPage-1);
    } else if(this.state.firstPage == this.state.currentPage && this.state.minPage < this.state.currentPage) {
      this.setState({ firstPage: this.state.currentPage-5, currentPage: this.state.currentPage-1 });
      this.props.updatePage(this.state.currentPage-1);
    }
  }

  nextPage() {
    let numPages = 5 > this.state.maxPage ? this.state.maxPage - 1 : 4;
    
    if(this.state.firstPage+4 != this.state.currentPage) {
      this.setState({ currentPage: this.state.currentPage+1 });
      this.props.updatePage(this.state.currentPage+1);
    } else if(this.state.firstPage+4 == this.state.currentPage && this.state.maxPage > this.state.currentPage) {
      this.setState({ firstPage: this.state.currentPage+1, currentPage: this.state.currentPage+1 });
      this.props.updatePage(this.state.currentPage+1);
    }
  }

  updatePage(pageNum) {
    this.setState({ currentPage: pageNum });
    this.props.updatePage(pageNum);
  }

  render() {
    // console.log(this.state);
      
    let { currentPage, firstPage, maxPage, minPage } = this.state;
    // let offset = 5 > this.state.maxPage ? 0 : 1;
    let offset = Math.ceil(this.state.currentPage/5) * 5 > this.state.maxPage ? this.state.maxPage : Math.ceil(this.state.currentPage/5) * 5;
    //style={{ left: `-${((150/window.innerWidth)/2)*100}%` }}
    // console.log(this.state.firstPage, this.state.currentPage, offset);
    return (
      <div className="">
        <ul style={{ display: 'flex', justifyContent: 'center' }} className="pagination bottomDiv">
          <li className={currentPage == minPage ? 'disabled' : ''} onClick={currentPage != minPage ? () => this.previousPage() : null}><a href="#">«</a></li>
          {Array.from(new Array(this.state.maxPage),(val,index)=>index).map((val, idx) => {
            if((idx+1) >= this.state.firstPage && (idx+1) <= offset)
              return <li key={`k${idx}`} className={currentPage == idx+1 ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{idx+1}</a></li>
          })}
          <li className={currentPage == maxPage ? 'disabled' : ''} onClick={currentPage != maxPage ? () => this.nextPage() : null}><a href="#">»</a></li>
        </ul>
      </div>
    );
  }
}

// if(idx + offset < this.state.maxPage)
//               return <li key={`k${idx}`} className={currentPage == firstPage+idx ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{this.state.firstPage + idx}</a></li>

{/*<li className={currentPage == firstPage ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{this.state.firstPage}</a></li>
          <li className={currentPage == firstPage+1 ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{this.state.firstPage + 1}</a></li>
          <li className={currentPage == firstPage+2 ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{this.state.firstPage + 2}</a></li>
          <li className={currentPage == firstPage+3 ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{this.state.firstPage + 3}</a></li>
          <li className={currentPage == firstPage+4 ? 'active' : ''} onClick={(ev) => this.updatePage(parseInt(ev.target.innerHTML))}><a href="#">{this.state.firstPage + 4}</a></li>*/}