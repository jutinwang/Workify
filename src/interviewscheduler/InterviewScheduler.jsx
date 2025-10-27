import { useState, useEffect } from "react";
import { DayPilotCalendar, DayPilot } from "@daypilot/daypilot-lite-react";
import './InterviewScheduler.css';

const InterviewScheduler = () => {
    const [calendar, setCalendar] = useState(null);
    const [events, setEvents] = useState([]);
    const [inviteText, setInviteText] = useState('');
    const [durationText, setDurationText] = useState('');
    const [locationText, setLocationText] = useState('');
    const [interviewTypeText, setInterviewTypeText] = useState('');
    const [messageText, setMessageText] = useState('');

    const handleChange = (event) => {
        setText(event.target.value);
    };

    // https://code.daypilot.org/42221/react-weekly-calendar-tutorial
    const config = {
        viewType: "WorkWeek",
        timeRangeSelectedHandling: "Enabled",
        durationBarVisible: false,
        eventCreateHandling: "Disabled",
        eventDeleteHandling: "Update",
        cellDuration: 30, // change this to add more time

        // Add delete button to each event
        onBeforeEventRender: args => {
            args.data.areas = [
                {
                    top: 3,
                    right: 3,
                    width: 20,
                    height: 20,
                    fontColor: "#333",
                    action: "None",
                    toolTip: "Delete event",
                    onClick: async args => {
                        calendar.events.remove(args.source);
                        setEvents((prev) => prev.filter(e => e.id !== args.source.id()));
                    }
                }
            ];
        },

        onTimeRangeSelected: async (args) => {
        const modal = await DayPilot.Modal.prompt(
            "Create a new event:",
            "Busy"
        );
        calendar.clearSelection();
        if (!modal.result) return;

        const newEvent = {
            start: args.start,
            end: args.end,
            id: DayPilot.guid(),
            text: modal.result,
        };

        calendar.events.add(newEvent);
        setEvents((prev) => [...prev, newEvent]);

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

    return (
        <div className="interviewscheduler-container">
            <div className="calendar-section">
                <div className="inviteTitle">
                    <img src="../src/assets/invite_title.png" className="inviteIcon" width="30" height="30"></img>
                    <p>Interview With Ali</p>
                </div>
                <div className="schedulerCalendar">
                    <DayPilotCalendar
                        {...config}
                        onTimeRangeSelected={async args => {
                            const newEvent = {
                                start: args.start,
                                end: args.end,
                                text: "Busy",
                                id: DayPilot.guid(),
                                backColor: "#465362",
                                fontColor: "#fff"
                            };

                            if (calendar) {
                                calendar.events.add(newEvent);
                            }
                        }}
                        events={events}
                        controlRef={setCalendar}
                    />
                </div>
            </div>
            
            <div className="invitedetails-section">
                <button className="sendButton">
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