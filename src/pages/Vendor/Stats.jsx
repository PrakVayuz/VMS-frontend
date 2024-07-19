// src/components/Stats.jsx
import React from 'react';

const Stats = () => {
  const stats = [
    { label: 'Active', value: 4 },
    { label: 'Profiles', value: 106 },
    { label: 'Shortlisted', value: 21 },
    { label: 'Offered', value: 0 },
    { label: 'Joins', value: 0 },
  ];

  return (
    <div className="flex justify-around p-4 bg-white shadow">
      {stats.map((stat, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
