import { useState, useMemo } from "react";
import JobsFilter from "./JobsFilter";
import JobCard from "./JobCard";
import './jobs.css';

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Internship", "Contract", "Co-op"];
const LEVELS = ["All Levels", "Junior", "Intermediate", "Senior", "Lead"];

const JOBS = [
    {
        id: 1,
        title: "Software Engineer",
        company: "TechStart Inc.",
        location: "San Francisco, CA",
        remote: true,
        type: "Full Time",
        level: "Mid",
        salary: { min: "120,000", max: "180,000" },
        skills: ["Python", "JavaScript", "React", "AWS", "Docker"],
        summary: "We are looking for a passionate Software Engineer to join our team building cutting-edge apps.",
        posted: "about 1 month ago",
        link: "#",
    },
    {
        id: 2,
        title: "Frontend Developer",
        company: "TechStart Inc.",
        location: "Remote",
        remote: true,
        type: "Full Time",
        level: "Entry",
        salary: { min: "90,000", max: "140,000" },
        skills: ["React", "TypeScript", "CSS", "Vite"],
        summary: "Join our frontend team to build amazing UIs with React and TypeScript.",
        posted: "about 1 month ago",
        link: "#",
    },
];

const Jobs = () => {

    const [filters, setFilters] = useState({
        jobType: JOB_TYPES[0],
        level: LEVELS[0],
        remoteOnly: false,
    });
    
    const filtered = useMemo(() => {
        return JOBS.filter(j => {
            const typeOk =
            filters.jobType === "All Types" ||
            j.type.toLowerCase().includes(filters.jobType.toLowerCase());
            const levelOk =
            filters.level === "All Levels" ||
            j.level.toLowerCase() === filters.level.toLowerCase();
            const remoteOk = !filters.remoteOnly || j.remote;
            return typeOk && levelOk && remoteOk;
        });
    }, [filters]);


    return (
        <div className="jobs-page-container">
            <JobsFilter filters={filters} setFilters={setFilters}/>
            <div className="jobs-list-container">
                <div className="jobs-list-head">
                <h2>Available Jobs</h2>
                <span className="jobs-count">{filtered.length} jobs found</span>
                </div>

                <div className="jobs-grid">
                {filtered.map(job => <JobCard key={job.id} job={job} />)}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
