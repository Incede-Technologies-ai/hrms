import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeList from './EmployeeList';
import EmployeeForm from './EmployeeForm';
import LeaveManagement from './LeaveManagement';
import InternManagement from './InternManagement';
import InternLeaveManagement from './InternLeaveManagement';
import Reports from './Reports';
import AssetManagement from './AssetManagement';
import AssetAssignment from './AssetAssignment';

import './Dashboard.css';

function Dashboard() {
  // Initialize activeTab from localStorage or default to 'addEmployee'
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'addEmployee');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const employeeListRef = useRef();
  const navigate = useNavigate();

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // Remove token from sessionStorage
    localStorage.removeItem('user'); // Remove user data if stored
    navigate('/'); // Redirect to login page
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setShowModal(false);
  };

  const refreshEmployeeList = () => {
    if (employeeListRef.current) {
      employeeListRef.current.fetchEmployees();
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src="/company-logo.png.png" alt="Company Logo" className="company-logo" />
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'addEmployee' ? 'active' : ''}`}
          onClick={() => setActiveTab('addEmployee')}
        >
          <i className="fas fa-user-plus"></i> Add Employee
        </button>
        <button
          className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <i className="fas fa-users"></i> Employees
        </button>
        <button
          className={`nav-btn ${activeTab === 'leaveManagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaveManagement')}
        >
          <i className="fas fa-calendar-alt"></i> Leave Management
        </button>
        <button
          className={`nav-btn ${activeTab === 'InternManagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('InternManagement')}
        >
          <i className="fas fa-users"></i> Intern Management
        </button>
        <button
          className={`nav-btn ${activeTab === 'InternLeaveManagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('InternLeaveManagement')}
        >
          <i className="fas fa-calendar-alt"></i> Intern Leave Management
        </button>
        <button
          className={`nav-btn ${activeTab === 'AssetManagement' ? 'active' : ''}`}
          onClick={() => setActiveTab('AssetManagement')}
        >
          <i className="fas fa-laptop"></i> Assets
        </button>
        <button
          className={`nav-btn ${activeTab === 'AssetAssignment' ? 'active' : ''}`}
          onClick={() => setActiveTab('AssetAssignment')}
        >
          <i className="fas fa-exchange-alt"></i> Asset Map
        </button>
        <button
          className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-chart-bar"></i> Reports
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'addEmployee' && (
          <EmployeeForm onSuccess={refreshEmployeeList} />
        )}
        {activeTab === 'employees' && (
          <EmployeeList ref={employeeListRef} onEditEmployee={handleEditEmployee} />
        )}
        {activeTab === 'leaveManagement' && <LeaveManagement />}
        {activeTab === 'reports' && <Reports />}
        {activeTab === 'InternManagement' && <InternManagement />}
        {activeTab === 'InternLeaveManagement' && <InternLeaveManagement />}
        {activeTab === 'AssetManagement' && <AssetManagement />}
        {activeTab === 'AssetAssignment' && <AssetAssignment />}
      </main>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2><i className="fas fa-edit"></i> Edit Employee</h2>
              <button onClick={handleCloseModal} className="close-btn">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <EmployeeForm
                employee={selectedEmployee}
                isEdit={true}
                onSuccess={refreshEmployeeList}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
