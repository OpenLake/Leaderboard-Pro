import React from "react";
import propTypes from "prop-types";
import _ from "lodash";

const Pagination = (props) => {
  const { itemCount, pageSize, currentPage, onPageChange } = props;
  const pagesCount = Math.ceil(itemCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);
  return (
    <div className="text-center">
      <ul className="pagination m-4">
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <p className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

Pagination.propTypes = {
  itemCount: propTypes.number.isRequired,
  pageSize: propTypes.number.isRequired,
  currentPage: propTypes.number.isRequired,
  onPageChange: propTypes.func.isRequired,
};
export default Pagination;
