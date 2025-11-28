import React, { useEffect, useState } from "react";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const calendarConfig = {
  viewType: "WorkWeek",
  durationBarVisible: false,
  timeRangeSelectedHandling: "Disabled",
  eventClickHandling: "Enabled",
  eventMoveHandling: "Disabled",
  eventResizeHandling: "Disabled",
  eventDeleteHandling: "Disabled",
  cellDuration: 30,
};

const StudentScheduleInterviewModal = ({ interview, onClose }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load available slots for this interview from backend
  useEffect(() => {
    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setError("");
        const token = localStorage.getItem("authToken");

        const res = await fetch(
          `http://localhost:4000/interviews/student/interviews/${interview.id}/slots`,
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

        console.log(data)

        if (!res.ok) {
          setError(data.error || "Failed to load available times.");
          setEvents([]);
          return;
        }

        const slots = Array.isArray(data.slots) ? data.slots : [];
        const mapped = slots.map((slot) => ({
          id: slot.id,
          start: slot.start,
          end: slot.end,
          text: "Available slot",
        }));

        setEvents(mapped);
      } catch (e) {
        console.error("Error loading interview slots:", e);
        setError("Unexpected error while loading available times.");
        setEvents([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [interview.id]);

  const jobTitle = interview.job?.title || "Interview";
  const companyName =
    interview.job?.company?.name ||
    interview.employer?.company?.name ||
    "Company";

  const handleEventClick = (args) => {
    // args.e is the DayPilot event object
    const id = args.e.data.id;
    setSelectedEventId(id);
    setError("");
  };

  const handleConfirm = async () => {
    if (!selectedEventId) {
      setError("Please click on a time slot in the calendar first.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const token = localStorage.getItem("authToken");

      const res = await fetch(
        `http://localhost:4000/interviews/student/interviews/${interview.id}/select-slot`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ slotId: selectedEventId }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to schedule interview.");
        return;
      }

      // success – close and tell parent we scheduled so it can refresh
      onClose(true);
    } catch (e) {
      console.error("Error selecting interview slot:", e);
      setError("Unexpected error while scheduling interview.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div
        className="modal-content"
        style={{ maxWidth: "900px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            Schedule Interview – {jobTitle} @ {companyName}
          </h2>
          <button className="modal-close" onClick={() => onClose(false)}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Select a time for your{" "}
            {interview.durationMinutes || ""}-minute interview by clicking an
            available slot on the calendar.
          </p>

          {interview.note && (
            <div className="modal-note">
              <strong>Message from employer:</strong>
              <p>{interview.note}</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <p>{error}</p>
            </div>
          )}

          {loadingSlots ? (
            <p>Loading available times…</p>
          ) : events.length === 0 ? (
            <p>No available slots. Please contact the employer.</p>
          ) : (
            <div className="student-calendar-wrapper">
              <DayPilotCalendar
                {...calendarConfig}
                events={events}
                onEventClick={handleEventClick}
                onBeforeEventRender={(args) => {
                  if (args.data.id === selectedEventId) {
                    args.data.backColor = "#1a73e8";
                    args.data.fontColor = "#ffffff";
                    args.data.borderColor = "#0f4fc1";
                  } else {
                    args.data.backColor = "#e3f2fd";
                    args.data.borderColor = "#90caf9";
                  }
                }}
              />
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn apps-btn-outline"
            onClick={() => onClose(false)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="btn apps-btn-success"
            onClick={handleConfirm}
            disabled={submitting || events.length === 0}
          >
            {submitting ? "Scheduling…" : "Confirm Selected Time"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentScheduleInterviewModal;
