import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';
import Swal from "sweetalert2";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CustomCalendar from './CustomCalendar'; // Import CustomCalendar

const Reports = () => {
    const [activeReport, setActiveReport] = useState(null);
    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employeeId, setEmployeeId] = useState("");
    const [leaveReportData, setLeaveReportData] = useState([]);
    const [assetId, setAssetId] = useState("");
    const [assetReportData, setAssetReportData] = useState([]);
    const [userAssetId, setUserAssetId] = useState("");
    const [employeeAssetReportData, setEmployeeAssetReportData] = useState([]);
    const [leaveBalanceData, setLeaveBalanceData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [inactiveEmployeeData, setInactiveEmployeeData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [hiredEmployeesData, setHiredEmployeesData] = useState([]);
    const [assetData, setAssetData] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    const downloadExcel = (reportTitle, tableData, tableHeaders) => {
        if (tableData.length === 0) {
            Swal.fire({
                icon: "warning",
                title: "No data available for export",
            });
            return;
        }
    
        const worksheetData = tableData.map(row => {
            let rowData = {};
            tableHeaders.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });
    
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(data, `${reportTitle}.xlsx`);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [employeesRes, leavesRes] = await Promise.all([
                axios.get('http://localhost:8080/api/employees'),
            ]);
            setEmployeeData(employeesRes.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
        setLoading(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
      };

    const fetchLeaveReport = async () => {
        if (!employeeId) {
            Swal.fire({
                icon: "error",
                title: "Enter a valid Employee ID"
            });
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:8080/api/reports/employee-leave/${employeeId}`);
            const rawData = response.data;
    
            let processedData = [];
    
            rawData.forEach((leave) => {
                processedData.push({
                    ...leave,
                    numberOfDays: leave.halfDay ? 0.5 : leave.numberOfDays || 1, 
                });
            });
    
            setLeaveReportData(processedData);
        } catch (error) {
            console.error("Error fetching leave report:", error);
        }
    };

    const fetchAssetReport = async () => {
        if (!assetId) {
            Swal.fire({
                icon: "error",
                title: "Enter a valid Asset ID"
            });
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:8080/api/asset-assignments/lookup/asset/${assetId}`);
            setAssetReportData(response.data);
        } catch (error) {
            console.error("Error fetching asset report:", error);
        }
    };

    const fetchEmployeeAssetReport = async () => {
        if (!userAssetId) {
            Swal.fire({
                icon: "error",
                title: "Enter a valid Employee ID"
            });
            return;
        }
    
        try {
            const response = await axios.get(`http://localhost:8080/api/asset-assignments/lookup/user/${userAssetId}`);
            setEmployeeAssetReportData(response.data);
        } catch (error) {
            console.error("Error fetching employee asset report:", error);
        }
    };

    const fetchInactiveEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/employees/inactive');
            setInactiveEmployeeData(response.data);
        } catch (error) {
            console.error("Error fetching inactive employees:", error);
        }
        setLoading(false);
    };

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/assets');
            setAssetData(response.data);
        } catch (error) {
            console.error("Error assets", error);
        }
        setLoading(false);
    };

    const fetchHiredEmployees = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/employees/hired', {
                params: {
                    startDate: startDate || null,
                    endDate: endDate || null
                }
            });
            setHiredEmployeesData(response.data);
        } catch (error) {
            console.error("Error fetching hired employees:", error);
        }
        setLoading(false);
    };

    // Common filter function
    const filterData = (data, searchTerm, keys) => {
        return data.filter(item =>
            keys.some(key => item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const reports = [
        {
            id: 'leave-report',
            title: 'Employee Leave Report',
            icon: 'fas fa-file-alt',
            description: 'Detailed leave history of an employee',
            component: () => (
                <div className="report-content">
                    <div className="table-container">
                        <div className="search-container">
                            <input 
                                className="form-control"
                                type="text"
                                placeholder="Enter Employee ID..."
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                            />
                            <button className="btn" onClick={fetchLeaveReport}>Get Report</button>
                            <button 
                                className="btn btn-success"
                                onClick={() => downloadExcel(
                                    "Employee_Leave_Report",
                                    leaveReportData.map(leave => [
                                        leave.employeeId,
                                        leave.fullName,
                                        formatDate(leave.startdate || leave.leaveDate),
                                        formatDate(leave.endDate || ''),
                                        leave.reason,
                                        leave.leaveType,
                                        leave.numberOfDays,
                                        leave.halfDay ? 'Yes' : 'No' 
                                    ]),
                                    ["Employee ID", "Name", "Start Date", "End Date", "Remarks", "Leave Type", "Number of Days", "Is Half Day"]
                                )}
                            >
                                Download Excel
                            </button>
                        </div>

                        {leaveReportData.length > 0 && (
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Remarks</th>
                                        <th>Leave Type</th>
                                        <th>Number of Days</th>
                                        <th>Half Day</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveReportData.map((leave, index) => (
                                        <tr key={index}>
                                            <td>{leave.employeeId}</td>
                                            <td>{leave.fullName}</td>
                                            <td>{formatDate(leave.startdate || leave.leaveDate)}</td>
                                            <td>{formatDate(leave.endDate)|| 'N/A'}</td>
                                            <td>{leave.reason}</td>
                                            <td>{leave.leaveType}</td>
                                            <td>{leave.numberOfDays}</td>
                                            <td>{leave.halfDay ? 'Yes' : 'No'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 'asset-report',
            title: 'Asset Assignment Report',
            icon: 'fas fa-box',
            description: 'Detailed report of all assignments for a specific asset',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Asset ID..."
                            value={assetId}
                            onChange={(e) => setAssetId(e.target.value)}
                        />
                        <button className="btn" onClick={fetchAssetReport}>Get Report</button>
                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Asset_Assignment_Report",
                                assetReportData.map(assignment => [
                                    assignment.assetId,
                                    assignment.userId,
                                    assignment.userName,
                                    assignment.userType,
                                    formatDate(assignment.issueDate),
                                    formatDate(assignment.returnDate),
                                    assignment.remarks
                                ]),
                                ["Asset ID", "User ID","User Name", "User Type", "Issue Date", "Return Date", "Remarks"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {assetReportData.length > 0 && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>User ID</th>
                                    <th>User Name</th>
                                    <th>User Type</th>
                                    <th>Issue Date</th>
                                    <th>Return Date</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assetReportData.map((assignment, index) => (
                                    <tr key={index}>
                                        <td>{assignment.assetId}</td>
                                        <td>{assignment.userId}</td>
                                        <td>{assignment.userName}</td>
                                        <td>{assignment.userType}</td>
                                        <td>{formatDate(assignment.issueDate)}</td>
                                        <td>{formatDate(assignment.returnDate )|| 'N/A'}</td>
                                        <td>{assignment.remarks || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )
        },
        {
            id: 'employee-asset-report',
            title: 'Employee/Intern Asset Report',
            icon: 'fas fa-user-tag',
            description: 'Detailed report of all assets assigned to a specific employee or intern',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Employee or Intern ID..."
                            value={userAssetId}
                            onChange={(e) => setUserAssetId(e.target.value)}
                        />
                        <button className="btn" onClick={fetchEmployeeAssetReport}>Get Report</button>
                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Employee_Asset_Report",
                                employeeAssetReportData.map(assignment => [
                                    assignment.assetId,
                                    assignment.userId,
                                    assignment.userName,
                                    assignment.userType,
                                    formatDate(assignment.issueDate),
                                    formatDate(assignment.returnDate),
                                    assignment.remarks
                                ]),
                                ["Asset ID", "User ID","User Name", "User Type", "Issue Date", "Return Date", "Remarks"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {employeeAssetReportData.length > 0 && (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>User ID</th>
                                    <th>User Name</th>
                                    <th>User Type</th>
                                    <th>Issue Date</th>
                                    <th>Return Date</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeAssetReportData.map((assignment, index) => (
                                    <tr key={index}>
                                        <td>{assignment.assetId}</td>
                                        <td>{assignment.userId}</td>
                                        <td>{assignment.userName}</td>
                                        <td>{assignment.userType}</td>
                                        <td>{formatDate(assignment.issueDate)}</td>
                                        <td>{formatDate(assignment.returnDate )|| 'N/A'}</td>
                                        <td>{assignment.remarks || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )
        },
        {
            id: 'leave-balance-report',
            title: 'Leave Balance Report',
            icon: 'fas fa-calendar-check',
            description: 'Overview of annual and sick leave balances for all employees',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search by Employee ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Leave_Balance_Report",
                                leaveBalanceData.map(employee => [
                                    employee.employeeId,
                                    employee.fullName,
                                    employee.leaves,
                                    employee.sickLeaves,
                                    employee.lopCount
                                ]),
                                ["Employee ID", "Name", "Annual Leave Balance", "Sick Leave Balance", "LOP"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {filterData(employeeData, searchTerm, ['employeeId', 'fullName']).length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Annual Leave Balance</th>
                                    <th>Sick Leave Balance</th>
                                    <th>LOP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterData(employeeData, searchTerm, ['employeeId', 'fullName']).map((employee, index) => (
                                    <tr key={index}>
                                        <td>{employee.employeeId}</td>
                                        <td>{employee.fullName}</td>
                                        <td>{employee.leaves}</td>
                                        <td>{employee.sickLeaves}</td>
                                        <td>{employee.lopCount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">No data available</div>
                    )}
                </div>
            )
        },
        {
            id: 'employee-directory',
            title: 'Employee Directory',
            icon: 'fas fa-users',
            description: 'A comprehensive list of all employees with details like name, position, department, contact information, etc.',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search by Employee ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Employee_Directory",
                                leaveBalanceData.map(employee => [
                                    employee.employeeId,
                                    employee.fullName,
                                    employee.department,
                                    formatDate(employee.joingDate),
                                    formatDate(employee.dateOfBirth),
                                    employee.contactNo,
                                    employee.personalEmail,
                                    employee.officialEmail,
                                ]),
                                ["Employee ID", "Name", "Department", "Joining Date", "Date of Birth", "Contact Number", "Personal Email", "Official Email"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {filterData(employeeData, searchTerm, ['employeeId', 'fullName']).length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Joining Date</th>
                                    <th>Date of Birth</th>
                                    <th>Contact Number</th>
                                    <th>Personal Email</th>
                                    <th>Official Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterData(employeeData, searchTerm, ['employeeId', 'fullName']).map((employee, index) => (
                                    <tr key={index}>
                                        <td>{employee.employeeId}</td>
                                        <td>{employee.fullName}</td>
                                        <td>{employee.department}</td>
                                        <td>{formatDate(employee.joiningDate)}</td>
                                        <td>{formatDate(employee.dateOfBirth)}</td>
                                        <td>{employee.contactNo}</td>
                                        <td>{employee.personalEmail}</td>
                                        <td>{employee.officialEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">No data available</div>
                    )}
                </div>
            )
        },
        {
            id: 'inactive-employee-report',
            title: 'Inactive Employee Report',
            icon: 'fas fa-user-slash',
            description: 'List of all inactive employees',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search by Employee ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={fetchInactiveEmployees}
                        >
                            Fetch Inactive Employees
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Inactive_Employee_Report",
                                filterData(inactiveEmployeeData, searchTerm, ['employeeId', 'fullName']).map(employee => [
                                    employee.employeeId,
                                    employee.fullName,
                                    employee.department,
                                    formatDate(employee.joiningDate),
                                    formatDate(employee.dateOfBirth),
                                    employee.contactNo,
                                    employee.personalEmail,
                                    employee.officialEmail
                                ]),
                                ["Employee ID", "Name", "Department", "Joining Date", "Date of Birth", "Contact Number", "Personal Email", "Official Email"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {filterData(inactiveEmployeeData, searchTerm, ['employeeId', 'fullName']).length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Joining Date</th>
                                    <th>Date of Birth</th>
                                    <th>Contact Number</th>
                                    <th>Personal Email</th>
                                    <th>Official Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterData(inactiveEmployeeData, searchTerm, ['employeeId', 'fullName']).map((employee, index) => (
                                    <tr key={index}>
                                        <td>{employee.employeeId}</td>
                                        <td>{employee.fullName}</td>
                                        <td>{employee.department}</td>
                                        <td>{formatDate(employee.joiningDate)}</td>
                                        <td>{formatDate(employee.dateOfBirth)}</td>
                                        <td>{employee.contactNo}</td>
                                        <td>{employee.personalEmail}</td>
                                        <td>{employee.officialEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data"></div>
                    )}
                </div>
            )
        },
        {
            id: 'available-asset-report',
            title: 'List of all available Assets',
            icon: 'fas fa-box',
            description: 'Detailed report of all assets that are currently available',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Search by Asset ID, Type, or Specification..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn" onClick={fetchAssets}>Get Available Assets</button>
                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Available_Asset_Report",
                                filterData(assetData, searchTerm, ['assetId', 'assetType', 'assetSpecification'])
                                    .sort((a, b) => a.assetId.localeCompare(b.assetId)) // Sort by assetId ascending
                                    .map(assignment => [
                                        assignment.assetId,
                                        assignment.assetType,
                                        assignment.assetSerialNo,
                                        assignment.assetSpecification,
                                        assignment.remarks
                                    ]),
                                ["Asset ID", "Asset Type", "Asset Serial Number", "Asset Specification", "Remarks"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {filterData(assetData, searchTerm, ['assetId', 'assetType', 'assetSpecification'])
                        .sort((a, b) => a.assetId.localeCompare(b.assetId)).length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Asset Type</th>
                                    <th>Asset Serial Number</th>
                                    <th>Asset Specification</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filterData(assetData, searchTerm, ['assetId', 'assetType', 'assetSpecification'])
                                    .sort((a, b) => a.assetId.localeCompare(b.assetId))
                                    .map((assignment, index) => (
                                        <tr key={index}>
                                            <td>{assignment.assetId}</td>
                                            <td>{assignment.assetType}</td>
                                            <td>{assignment.assetSerialNo}</td>
                                            <td>{assignment.assetSpecification}</td>
                                            <td>{assignment.remarks || 'N/A'}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">No data available</div>
                    )}
                </div>
            )
        },
        {
            id: 'hired-employees-report',
            title: 'Hired Employees Report',
            icon: 'fas fa-user-plus',
            description: 'List of employees hired between specific dates',
            component: () => (
                <div className="report-content">
                    <div className="search-container">
                        <CustomCalendar
                            value={startDate}
                            onChange={setStartDate}
                            minDate={null}
                        />
                        <CustomCalendar
                            value={endDate}
                            onChange={setEndDate}
                            minDate={startDate ? new Date(startDate) : null}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={fetchHiredEmployees}
                        >
                            Fetch Hired Employees
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={() => downloadExcel(
                                "Hired_Employees_Report",
                                hiredEmployeesData.map(employee => [
                                    employee.employeeId,
                                    employee.fullName,
                                    employee.department,
                                    formatDate(employee.joiningDate),
                                    employee.contactNo,
                                    employee.personalEmail,
                                    employee.officialEmail
                                ]),
                                ["Employee ID", "Name", "Department", "Joining Date", "Contact Number", "Personal Email", "Official Email"]
                            )}
                        >
                            Download Excel
                        </button>
                    </div>

                    {hiredEmployeesData.length > 0 ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Joining Date</th>
                                    <th>Contact Number</th>
                                    <th>Personal Email</th>
                                    <th>Official Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hiredEmployeesData.map((employee, index) => (
                                    <tr key={index}>
                                        <td>{employee.employeeId}</td>
                                        <td>{employee.fullName}</td>
                                        <td>{employee.department}</td>
                                        <td>{formatDate(employee.joiningDate)}</td>
                                        <td>{employee.contactNo}</td>
                                        <td>{employee.personalEmail}</td>
                                        <td>{employee.officialEmail}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">No data available</div>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="reports-section">
            <div className="section-header">
                <h2><i className="fas fa-chart-bar"></i> Reports Dashboard</h2>
            </div>
            
            <div className="reports-grid">
                {reports.map(report => (
                    <div 
                        key={report.id}
                        className={`report-card ${activeReport === report.id ? 'active' : ''}`}
                        onClick={() => setActiveReport(report.id)}
                    >
                        <div className="report-icon">
                            <i className={report.icon}></i>
                        </div>
                        <div className="report-info">
                            <h3>{report.title}</h3>
                            <p>{report.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="loading">Loading reports...</div>
            ) : (
                activeReport && (
                    <div className="report-details">
                        <h3>{reports.find(r => r.id === activeReport)?.title}</h3>
                        {reports.find(r => r.id === activeReport)?.component()}
                    </div>
                )
            )}
        </div>
    );
};

export default Reports;
