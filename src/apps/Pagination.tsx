const Pagination = ({ page, totalPages, onPageChange }) => {
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <nav className="pagination">
      <button className="btn" onClick={prev} disabled={page === 1}>Prev</button>
      <span className="page-indicator">Page {page} of {totalPages}</span>
      <button className="btn" onClick={next} disabled={page === totalPages}>Next</button>
    </nav>
  );
};

export default Pagination;
