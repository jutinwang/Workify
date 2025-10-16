import React from 'react';
import { useParams } from 'react-router-dom';
import './ExpandedJobView.css';

const ExpandedJobView = () => {
    const { id } = useParams();

  return (
    <div className="expanded-job-view">
      <h1>Expanded Job View</h1>
    </div>
  );
};

export default ExpandedJobView;
