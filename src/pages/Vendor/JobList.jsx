// src/components/JobList.jsx
import React from 'react';

const jobs = [
  {
    id: 'PR6909',
    title: 'SENIOR ENGINEER - CIRCLE CI, AWS DEVOPS',
    location: 'Ahmedabad, Pune, Bengaluru, Thane, Gurgoan',
    manager: 'amit.ghaghra@apexon.com',
    posted: '18-June-2024',
  },
  {
    id: 'PR6930',
    title: 'ENGINEER II- SERVICE NOW, REACT JS, HTML, CSS',
    location: 'Any',
    manager: 'vimarsh.mehta@apexon.com',
    posted: '18-June-2024',
  },
  {
    id: 'PR6028',
    title: 'SENIOR ENGINEER- JAVA',
    location: 'Pune, Bengaluru, Chennai, Hyderabad',
    experience: 'Above 8 Years',
    manager: 'Krishnakumar.Guna@apexon.com',
    posted: '11-April-2024',
  },
  {
    id: 'PR6211',
    title: 'LEAD ENGINEER- ANALYST, SQL',
    location: 'Any',
    experience: '6 to 9 Years',
    manager: 'arpita.ray@apexon.com',
    posted: '03-April-2024',
  },
];

const JobList = () => {
  return (
    <div className="p-4 bg-white shadow mt-4">
      <div className="flex justify-start items-center mb-4">
        <input
          type="text"
          placeholder="Enter Job Title or Location to begin searching"
          className="border p-2 rounded w-full max-w-lg"
        />
        <button className="ml-4 p-2 bg-blue-500 text-white rounded">Search</button>
      </div>
      {jobs.map((job) => (
        <div key={job.id} className="flex justify-between items-center border-t py-2">
          <div>
            <div className="text-lg font-semibold">{`JOB #${job.id}, ${job.title}`}</div>
            <div className="text-gray-600">
              {`Location: ${job.location} | Hiring Manager: ${job.manager} | Posted: ${job.posted}`}
            </div>
          </div>
          <button className="p-2 bg-blue-500 text-white rounded">Upload Profile</button>
        </div>
      ))}
    </div>
  );
};

export default JobList;
