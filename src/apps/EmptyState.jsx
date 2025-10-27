const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-emoji" aria-hidden>🔎</div>
    <h3>No applications found</h3>
    <p>Try adjusting your filters or search query.</p>
  </div>
);

export default EmptyState;
