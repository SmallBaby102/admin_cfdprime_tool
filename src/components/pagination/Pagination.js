import React from "react";
import { Pagination, PaginationLink, PaginationItem } from "reactstrap";
import Icon from "../icon/Icon";
import ReactPagination from 'react-bootstrap/Pagination';

const PaginationComponent = ({ itemPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const displayPagenumber = 16;
  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumbers.push(i);
  }
  const displayPagenumbers = [];
  if (pageNumbers[pageNumbers.length - 1] < displayPagenumber) {
    for (let i = 1; i <= pageNumbers[pageNumbers.length - 1]; i++) {
      displayPagenumbers.push(i);
    }
  } else{
    if (currentPage <= displayPagenumber / 2) {
      for (let i = 1; i <= displayPagenumber; i++) {
        displayPagenumbers.push(i);
      }
    } else if (currentPage > Math.ceil(totalItems / itemPerPage) - displayPagenumber / 2) {
      for (let i = Math.ceil(totalItems / itemPerPage) - displayPagenumber / 2; i <= Math.ceil(totalItems / itemPerPage); i++) {
        displayPagenumbers.push(i);
      }  
    } else {
      for (let i = currentPage - displayPagenumber / 2; i < currentPage + displayPagenumber / 2; i++) {
        displayPagenumbers.push(i);
      }
    }
  }

  
  const nextPage = () => {
    paginate(currentPage + 1);
  };

  const prevPage = () => {
    paginate(currentPage - 1);
  };
  const firstPage = () => {
    paginate(1);
  };
  const lastPage = () => {
    paginate(pageNumbers[pageNumbers.length - 1]);
  };

  return (
    <Pagination aria-label="Page navigation example">
       <button className="page-link"
          onClick={(ev) => {
            ev.preventDefault();
            firstPage();
          }} 
        >First</button>
      <PaginationItem disabled={currentPage - 1 === 0 ? true : false}>
        <PaginationLink
          className="page-link-prev"
          onClick={(ev) => {
            ev.preventDefault();
            prevPage();
          }}
          href="#prev"
        >
          <Icon name="chevrons-left" />
          <span>Prev</span>
        </PaginationLink>
      </PaginationItem>
      {(currentPage > displayPagenumber === 0) && <ReactPagination.Ellipsis /> }
      {displayPagenumbers.map((item) => {
        return (
          <div>
              
              <PaginationItem className={currentPage === item ? "active" : ""} key={item}>
                <PaginationLink
                  tag="a"
                  href="#pageitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    paginate(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
          </div>
        );
      })}

      <PaginationItem disabled={pageNumbers[pageNumbers.length - 1] === currentPage}>
        <PaginationLink
          className="page-link-next"
          onClick={(ev) => {
            ev.preventDefault();
            nextPage();
          }}
          href="#next"
        >
          <span>Next</span>
          <Icon name="chevrons-right" />
        </PaginationLink>
      </PaginationItem>
      <button className="page-link"
          onClick={(ev) => {
            ev.preventDefault();
            lastPage();
          }} 
        >Last</button>
    </Pagination>
  );
};
export default PaginationComponent;
