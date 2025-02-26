import { Pagination } from "react-bootstrap";
import { useMemo } from "react";

const CustomPagination = ({ page, setPage, pageCount }) => {
  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
  };

  const paginationItems = useMemo(() => {
    const items = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pageCount, page + Math.floor(maxPagesToShow / 2));

    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          active={page === 1}
          onClick={() => handlePageClick(1)}
        >
          1
        </Pagination.Item>
      );

      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }

      items.push(
        <Pagination.Item
          key={pageCount}
          active={page === pageCount}
          onClick={() => handlePageClick(pageCount)}
        >
          {pageCount}
        </Pagination.Item>
      );
    }

    return items;
  }, [page, pageCount]);

  return (
    <div className="d-flex justify-content-center py-3">
      <Pagination>
        <Pagination.Prev
          onClick={() => page > 1 && handlePageClick(page - 1)}
        />
        {paginationItems}
        <Pagination.Next
          onClick={() => page < pageCount && handlePageClick(page + 1)}
        />
      </Pagination>
    </div>
  );
};

export default CustomPagination;
