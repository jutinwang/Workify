import { useState, useEffect } from "react";
import { DayPilotCalendar, DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import './InterviewScheduler.css';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const InterviewScheduler = () => {
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        async function loadUnavailable() {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:4000/employers/me/unavailable-times", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();
            console.log('Loaded events:', data);

            setEvents(data.unavailableTimes);
        }
        loadUnavailable();
    }, []);

    const saveEventsToBackend = async (newEvents) => {
        const token = localStorage.getItem("authToken");
        
        try {
            const response = await fetch("http://localhost:4000/employers/me/unavailable-times", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ events: newEvents }),
            });
            
            if (!response.ok) {
                console.error('Failed to save events');
            }
        } catch (error) {
            console.error('Error saving events:', error);
        }
    };

    const config = {
        viewType: "WorkWeek",
        timeRangeSelectedHandling: "Enabled",
        durationBarVisible: false,
        eventCreateHandling: "Disabled",
        eventDeleteHandling: "Update",
        cellDuration: 30,

        onBeforeEventRender: args => {
            args.data.areas = [
                {
                    top: 3,
                    right: 3,
                    width: 20,
                    height: 20,
                    action: "None",
                    onClick: async (clickArgs) => {
                        calendar.events.remove(clickArgs.source);
                        const updated = events.filter(e => e.id !== clickArgs.source.id());
                        setEvents(updated);
                        await saveEventsToBackend(updated);
                    }
                }
            ];
        },

        onEventClick: async (args) => {
            const modal = await DayPilot.Modal.prompt(
                "Update event text:",
                args.e.text()
            );
            if (!modal.result) return;
            args.e.data.text = modal.result;
            calendar.events.update(args.e);
        },
    };
    console.log(events)

    return (
        <div className="interviewscheduler-container">
            <div className="header-section">
                <AccessTimeIcon className="headerIcon" />
                <h1>Change Your Availability</h1>
            </div>

            <div className="content-wrapper">
                <div className="left-section">
                    <div className="date-selection-section">
                        <h3>Date Selection</h3>
                        <DayPilotNavigator 
                            onTimeRangeSelected={ args => {
                                setStartDate(args.day);
                            }}
                        />
                        <button className="saveButton" onClick={() => saveEventsToBackend(events)}>
                            <SendIcon className="sendIcon" />
                            Save Availability
                        </button>
                    </div>
                </div>

                <div className="right-section">
                    <div className="how-to-section">
                        <h3>How to Use:</h3>
                        <ul>
                            <li>Click and drag on the calendar to block out times when you're unavailable</li>
                            <li>Click on an existing block to edit or remove it</li>
                            <li>Click "Save Availability" to update your schedule</li>
                            <li>Students will only be able to book interviews during your available times</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="calendar-section">
                <h3>Your Schedule</h3>
                <DayPilotCalendar
                    {...config}
                    startDate={startDate}
                    onTimeRangeSelected={(args) => {
                        const newEvent = {
                            start: args.start,
                            end: args.end,
                            text: "Busy",
                            id: DayPilot.guid(),
                            backColor: "#465362",
                            fontColor: "#fff",
                        };
                        setEvents((prev) => [...prev, newEvent]);
                    }}
                    events={events}
                    controlRef={setCalendar}
                />
            </div>
        </div>
    );
};

export default InterviewScheduler;