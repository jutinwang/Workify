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
        eventCreateHandling: "Disabled",
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

    useEffect(() => {
        // Example
        // preload some example events
        const initialEvents = [
        {
            id: 1,
            text: "Team Interview",
            start: DayPilot.Date.today().addHours(9),
            end: DayPilot.Date.today().addHours(10),
            backColor: "#6aa84f",
        },
        ];
        setEvents(initialEvents);
    }, []);


    return (
        <div className="interviewscheduler-container">
            <div className="calendar-section">
                <div className="inviteTitle">
                    <img src="../src/assets/invite_title.png" width="30" height="30"></img>
                    <p>Interview With Ali</p>
                </div>
                <div className="schedulerCalendar">
                    <DayPilotCalendar
                        // {...config}
                        // events={events}
                        // controlRef={setCalendar}

                        {...config}
                        onTimeRangeSelected={async args => {
                            const newEvent = {
                            start: args.start,
                            end: args.end,
                            text: "Busy",
                            id: DayPilot.guid()
                            };

                            setEvents(prev => [...prev, newEvent]);
                        }}
                        events={events}
                    />
                </div>
            </div>
            
            <div className="invitedetails-section">
                <button className="sendButton">
                    <img src="../src/assets/send.webp" width="30" height="30"></img>
                    Send
                </button>
                <div className="inviteOthersSection">
                    <img src="../src/assets/invite_others.png" width="30" height="30"></img>
                    <textarea className="inviteInput"
                        value={inviteText}
                        onChange={(e) => setInviteText(e.target.value)}
                        placeholder="Invite Someone..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '300px',     // Adjust as needed
                            height: '25px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div className="duration-section">
                    <img src="../src/assets/clock.png" width="30" height="30"></img>
                    <textarea className="durationInput"
                        value={durationText}
                        onChange={(e) => setDurationText(e.target.value)}
                        placeholder="Set Time..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '300px',     // Adjust as needed
                            height: '25px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                
                <div className="location-section">
                    <img src="../src/assets/location.png" width="30" height="30"></img>
                    <textarea className="locationInput"
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                        placeholder="Add Location..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '300px',     // Adjust as needed
                            height: '25px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div className="interviewtype-section">
                    <img src="../src/assets/type.png" width="30" height="30"></img>
                    <textarea className="interviewInput"
                        value={interviewTypeText}
                        onChange={(e) => setInterviewTypeText(e.target.value)}
                        placeholder="Interview Type..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '300px',     // Adjust as needed
                            height: '25px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                <div className="message-section">
                    <img src="../src/assets/page.png" width="30" height="30"></img>
                    <textarea className="messageInput"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type message here..."
                        style={{
                            minHeight: '40px', // Optional: set a minimum height
                            resize: 'none',    // Prevent manual resizing by user
                            overflowY: 'auto',
                            overflow: 'hidden', // Hide scrollbar
                            width: '300px',     // Adjust as needed
                            height: '355px',
                            border: '1.5px',
                            borderStyle: 'solid',
                            borderColor: 'black',
                            borderRadius: '8px',
                            padding: '10px',
                            fontSize: '14px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

            </div>
        </div>
    );
};

export default InterviewScheduler;