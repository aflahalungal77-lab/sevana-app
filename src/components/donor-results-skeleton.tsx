export function DonorResultsSkeleton() {
  return (
    <div className="donor-results-skeleton" role="status" aria-live="polite" aria-label="Loading donor results">
      <span className="sr-only">Searching for matching donors…</span>
      {[0, 1, 2].map((item) => (
        <div className="donor-skeleton-card" key={item} aria-hidden="true">
          <span className="donor-skeleton-badge" />
          <span className="donor-skeleton-copy">
            <span className="donor-skeleton-line donor-skeleton-line-title" />
            <span className="donor-skeleton-line donor-skeleton-line-short" />
            <span className="donor-skeleton-line donor-skeleton-line-meta" />
          </span>
        </div>
      ))}
    </div>
  );
}
