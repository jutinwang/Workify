/**
 * Format an ISO date string to a human-readable relative time
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted relative time (e.g., "2 days ago", "Just now")
 */
export function formatRelativeDate(isoDate) {
  if (!isoDate) return "Date not available";

  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

/**
 * Format an ISO date string to a standard date format
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted date (e.g., "Nov 14, 2025")
 */
export function formatDate(isoDate) {
  if (!isoDate) return "Date not available";

  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format an ISO date string to a date and time format
 * @param {string} isoDate - ISO 8601 date string
 * @returns {string} Formatted date and time (e.g., "Nov 14, 2025, 2:30 PM")
 */
export function formatDateTime(isoDate) {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
