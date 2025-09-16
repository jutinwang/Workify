import './job-card.css';

export default function JobCard({ job }) {
    const initials = job.company
      ?.split(" ")
      .map(w => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  
    return (
        <article className="job-card">
            {/* Header */}
            <div className="job-head">
            <div className="job-avatar">{initials}</div>
            <div className="job-titleblock">
                <h3 className="job-title">{job.title}</h3>
                <div className="job-company">{job.company}</div>
                <div className="job-meta">
                <span className="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/></svg>
                    {job.location}
                </span>
                {job.remote && <span className="pill">Remote</span>}
                </div>
            </div>
            </div>
    
            {/* Summary */}
            <p className="job-summary">{job.summary}</p>
    
            {/* Facts row */}
            <div className="job-facts">
            <span className="fact">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4h10a2 2 0 0 1 2 2v3H5V6a2 2 0 0 1 2-2Zm-2 7h14v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Zm4 2v2h6v-2H9Z"/></svg>
                {job.type}
            </span>
            <span className="fact">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 1 1-6.36 2.64A9 9 0 0 1 12 3Zm1 5h-2v5h5v-2h-3V8Z"/></svg>
                {job.level}
            </span>
            </div>
    
            {/* Salary */}
            {job.salary && <div className="job-salary">${job.salary.min} – ${job.salary.max}</div>}
    
            {/* Tags */}
            {job.skills?.length > 0 && (
            <div className="job-tags">
                {job.skills.slice(0, 3).map(s => (
                <span key={s} className="tag">{s}</span>
                ))}
                {job.skills.length > 3 && (
                <span className="tag tag--muted">+{job.skills.length - 3} more</span>
                )}
            </div>
            )}
    
            {/* Footer */}
            <div className="job-foot">
            <span className="posted">• {job.posted}</span>
            <a className="btn btn--dark" href={job.link} target="_blank" rel="noreferrer">
                View Details
            </a>
            </div>
        </article>
    );
}
  