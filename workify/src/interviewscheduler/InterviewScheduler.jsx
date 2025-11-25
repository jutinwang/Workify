import { useState, useEffect } from "react";
import { DayPilotCalendar, DayPilot, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import './InterviewScheduler.css';

const InterviewScheduler = () => {
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);
    const [inviteText, setInviteText] = useState('');
    const [durationText, setDurationText] = useState('');
    const [locationText, setLocationText] = useState('');
    const [interviewTypeText, setInterviewTypeText] = useState('');
    const [messageText, setMessageText] = useState('');
    const [startDate, setStartDate] = useState("2025-10-04");

    // Helper to normalize DayPilot.Date to local ISO string (no Z)
    const fromLocalISOString = (isoString) => {
        const d = new Date(isoString);
        console.log(d)
        return new DayPilot.Date(d);
    };

    const toLocalISOString = (date) => {
        const d = date instanceof DayPilot.Date ? date.toDate() : new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    };

    // Normalize events before saving
    const normalizeEvents = (evts) => {
        return evts.map(e => ({
            id: e.id,
            start: toLocalISOString(e.start),
            end: toLocalISOString(e.end),
            text: e.text || 'Busy',
            backColor: e.backColor || '#465362',
            fontColor: e.fontColor || '#fff',
        }));
    };

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

            const eventsWithDates = (data.unavailableTimes || []).map(event => ({
                ...event,
                start: fromLocalISOString(event.start),
                end: fromLocalISOString(event.end),
            }));

            setEvents(eventsWithDates);
        }
        loadUnavailable();
    }, []);

    const saveEventsToBackend = async (newEvents) => {
        const token = localStorage.getItem("authToken");
        // const normalized = normalizeEvents(newEvents);
        // console.log('Saving normalized events:', normalized);
        
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
            <div className="calendar-section">
                <div className="inviteTitle">
                    <img src="../src/assets/invite_title.png" className="inviteIcon" width="30" height="30"></img>
                    <p>Interview With Ali</p>
                </div>
                <div className="schedulerCalendar">
                    <DayPilotNavigator 
                        onTimeRangeSelected={ args => {
                            setStartDate(args.day);
                        }}
                    />
                    <DayPilotCalendar
                        {...config}
                        startDate={startDate}
                        onTimeRangeSelected={(args) => {
                            const newEvent = {
                                start: args.start,  // Keep as DayPilot.Date for UI
                                end: args.end,      // Keep as DayPilot.Date for UI
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
            
            <div className="invitedetails-section">
                <button className="sendButton" onClick={() => saveEventsToBackend(events)}>
                    <img src="../src/assets/send.webp" className="sendIcon" width="30" height="30"></img>
                    Send
                </button>
                <div className="inviteOthersSection">
                    <img src="../src/assets/invite_others.png" width="30" height="30"></img>
                    <textarea className="inviteInput"
                        value={inviteText}
                        onChange={(e) => setInviteText(e.target.value)}
                        placeholder="Invite Someone..."
                    />
                </div>

                <div className="duration-section">
                    <img src="../src/assets/clock.png" className="clockIcon" width="30" height="30"></img>
                    <textarea className="durationInput"
                        value={durationText}
                        onChange={(e) => setDurationText(e.target.value)}
                        placeholder="Set Time..."
                    />
                </div>
                
                <div className="location-section">
                    <img src="../src/assets/location.png" className="locationIcon" width="30" height="30"></img>
                    <textarea className="locationInput"
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                        placeholder="Add Location..."
                    />
                </div>

                <div className="interviewtype-section">
                    <img src="../src/assets/type.png" className="typeIcon" width="30" height="30"></img>
                    <textarea className="interviewInput"
                        value={interviewTypeText}
                        onChange={(e) => setInterviewTypeText(e.target.value)}
                        placeholder="Interview Type..."
                    />
                </div>

                <div className="message-section">
                    <img src="../src/assets/page.png" className="pageIcon" width="30" height="30"></img>
                    <textarea className="messageInput"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type message here..."
                    />
                </div>

            </div>
        </div>
    );
};

export default InterviewScheduler;