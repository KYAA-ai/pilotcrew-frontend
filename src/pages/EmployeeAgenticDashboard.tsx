import { EmployeeLayout } from "@/components/layout/EmployeeLayout";
import React from 'react';

const EmployeeAgenticDashboard: React.FC = () => {
  return (
    <EmployeeLayout sidebarCollapsible="icon">
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          minHeight: '60vh',
          width: '100%',
        }}
        className="agentic-dashboard-container"
      >
        <div
          style={{
            flex: 1,
            padding: '2rem',
            borderRight: '1px solid #eee',
            minWidth: 0,
          }}
          className="agentic-dashboard-left"
        >
          <h2>Left Section</h2>
          <p>This is the left half of the dashboard.</p>
        </div>
        <div
          style={{
            flex: 1,
            padding: '2rem',
            minWidth: 0,
          }}
          className="agentic-dashboard-right"
        >
          <h2>Right Section</h2>
          <p>This is the right half of the dashboard.</p>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .agentic-dashboard-container {
            flex-direction: column !important;
          }
          .agentic-dashboard-left {
            border-right: none;
            border-bottom: 1px solid #eee;
          }
        }
      `}</style>
    </EmployeeLayout>
  );
};

export default EmployeeAgenticDashboard; 