import React, { useState, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const previewConfig = {
    viewType: "WorkWeek",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Disabled",
    eventClickHandling: "Disabled",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    eventDeleteHandling: "Disabled",
    cellDuration: 30,
};

const ScheduleInterviewModal = ({ candidate, jobId, onClose }) => {
    const [events, setEvents] = useState([]);
    const [duration, setDuration] = useState(30);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAvailability = async () => {
            try {
                setLoading(true);
                setError("");
                const token = localStorage.getItem("authToken");
                const res = await fetch(
                    "http://localhost:4000/employers/me/unavailable-times",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    setError(data.error || "Failed to load availability.");
                } else {
                    setEvents(Array.isArray(data.unavailableTimes) ? data.unavailableTimes : []);
                }
            } catch (e) {
                console.error("Error loading availability:", e);
                setError("Unexpected error while loading availability.");
            } finally {
                setLoading(false);
            }
        };

        loadAvailability();
    }, []);

    const handleSend = async () => {
        try {
            setSending(true);
            setError("");
            const token = localStorage.getItem("authToken");

            const res = await fetch("http://localhost:4000/interviews", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    jobId,
                    studentId: candidate.studentId,
                    durationMinutes: duration,
                    note,
                    availability: events,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || "Failed to send interview invite.");
                return;
            }

            alert("Interview availability sent to the candidate.");
            onClose();
        } catch (e) {
            console.error("Error sending interview:", e);
            setError("Unexpected error while sending invite.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "900px" }}
            >
                <div className="modal-header">
                    <div className="modal-candidate-info">
                        <div>
                        <h2 className="modal-name">
                            Schedule Interview with {candidate.name}
                        </h2>
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <section className="modal-section">
                        <h3>Your Availability</h3>
                        {loading ? (
                        <p>Loading availability…</p>
                        ) : events.length === 0 ? (
                        <p>
                            You don&apos;t have any availability saved yet. Go to your
                            availability page to set it up.
                        </p>
                        ) : (
                        <div>
                            <DayPilotCalendar
                            {...previewConfig}
                            events={events}
                            
                            />
                        </div>
                        )}
                    </section>

                    <section className="modal-section">
                        <h3>Interview Details</h3>
                        <div className="form-row">
                            <label htmlFor="duration-select">Interview length</label>
                            <select
                                id="duration-select"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <label htmlFor="note-textarea">
                                Note to {candidate.name} (optional)
                            </label>
                            <textarea
                                id="note-textarea"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                                placeholder="e.g. This will be a 30-minute Zoom interview with 2 engineers."
                            />
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}
                    </section>
                </div>

                <div className="modal-footer">
                    <button className="reject-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="schedule-btn"
                        onClick={handleSend}
                        disabled={sending || loading || events.length === 0}
                    >
                        {sending ? "Sending…" : "Send to Candidate"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInterviewModal;
