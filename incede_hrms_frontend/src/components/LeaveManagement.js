import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './LeaveManagement.css';
import CustomCalendar from './CustomCalendar'; // Import CustomCalendar


const LeaveManagement = () => {
    const [leaves, setLeaves] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const rowsPerPage = 6;


    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        leaveType: 'Annual',
        duration: 'FULL_DAY',  // Set a default value
        startDate: '',
        endDate: '',
        reason: '',
        status: 'Pending',
        isLop: false,
        noOfLeaves: 1
    });


    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            // First, get all employees
            const employeesResponse = await axios.get('http://localhost:8080/api/employees');
            const employees = employeesResponse.data.sort((a, b) => a.id - b.id);

            // Then get leave balances for each employee
            const leavesWithBalance = await Promise.all(
                employees.map(async (employee) => {
                    try {
                        const balanceResponse = await axios.get(`http://localhost:8080/api/leave/balance/${employee.employeeId}`);
                        const leaveBalance = balanceResponse.data || {}; // Ensure leaveBalance is an object
                        return {
                            id: employee.id,
                            employeeId: employee.employeeId,
                            employeeName: employee.fullName,
                            leaveBalance: {
                                normalLeaveBalance: leaveBalance.normalLeaveBalance || 0.0,
                                sickLeaveBalance: leaveBalance.sickLeaveBalance || 0.0,
                                lopCount: leaveBalance.lopCount || 0.0
                            },
                            status: 'Active'
                        };
                    } catch (error) {
                        console.error(`Error fetching leave balance for employee ${employee.employeeId}:`, error);
                        return null;
                    }
                })
            );

            // Filter out any null values from failed requests
            const validLeaves = leavesWithBalance.filter(leave => leave !== null);
            setLeaves(validLeaves);
        } catch (error) {
            console.error('Error fetching leaves:', error);
            Swal.fire('Error', 'Failed to fetch leave records', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate leave balance
        if (formData.leaveType === 'Annual' && formData.noOfLeaves > formData.leaveBalance.normalLeaveBalance) {
            Swal.fire('Error', 'Insufficient annual leave balance', 'error');
            return;
        }
        if (formData.leaveType === 'Sick' && formData.noOfLeaves > formData.leaveBalance.sickLeaveBalance) {
            Swal.fire('Error', 'Insufficient sick leave balance', 'error');
            return;
        }

        const leaveData = {
            employeeId: formData.employeeId,
            leaveType: formData.leaveType ? formData.leaveType.toUpperCase() : 'ANNUAL',
            duration: formData.duration || "",
            leaveDate: formData.noOfLeaves > 1 ? null : formData.leaveDate,
            startDate: formData.noOfLeaves > 1 ? formData.startDate || null : null,
            endDate: formData.noOfLeaves > 1 ? formData.endDate || null : null,
            isHalfDay: formData.duration ? formData.duration.includes("HALF_DAY") : false,
            isLop: formData.leaveType ? formData.leaveType.toUpperCase() === "LOP" : false,
            reason: formData.reason || "",
            noOfLeaves: formData.noOfLeaves || 1, // Include number of days in the payload
            numberOfDays: formData.noOfLeaves || 1 // Explicitly add numberOfDays field
        };

        console.log("Submitting Leave Request:", leaveData);

        try {
            await axios.post('http://localhost:8080/api/leave/mark', leaveData);
            Swal.fire('Success', 'Leave request submitted successfully', 'success');
            setShowForm(false);
            setSelectedLeave(null);
            resetForm();
            fetchLeaves();
        } catch (error) {
            console.error('Error submitting leave request:', error);
            Swal.fire('Error', 'Failed to submit leave request', 'error');
        }
    };

    const handleEdit = (leave) => {
        setSelectedLeave(leave);
        setFormData({
            employeeId: leave.employeeId,
            employeeName: leave.employeeName,
            leaveType: leave.leaveType || 'Annual',
            duration: leave.duration || 'FULL_DAY',
            startDate: leave.startDate || '',
            endDate: leave.endDate || '',
            reason: leave.reason || '',
            status: leave.status || 'Pending',
            leaveBalance: leave.leaveBalance || {
                normalLeaveBalance: 0,
                sickLeaveBalance: 0,
                lopCount: 0
            }
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axios.delete(`http://localhost:8080/api/leaves/${id}`);
                Swal.fire('Deleted!', 'Leave request has been deleted.', 'success');
                fetchLeaves();
            }
        } catch (error) {
            console.error('Error deleting leave request:', error);
            Swal.fire('Error', 'Failed to delete leave request', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            employeeId: '',
            employeeName: '',
            leaveType: 'Annual',
            duration: '',
            startDate: '',
            endDate: '',
            reason: '',
            status: 'Pending'
        });
    };

    const handleCreditAnnualLeaves = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to credit annual leave for this month?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, credit it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post('http://localhost:8080/api/leave/credit-annual-leaves');
                if (response.data.includes('Annual leaves have already been credited for this month.')) {
                    Swal.fire('Warning', response.data, 'warning');
                } else {
                    Swal.fire('Success', response.data, 'success');
                }
            } catch (error) {
                Swal.fire('Error', error.response?.data || 'Failed to credit annual leaves', 'error');
            }
        }
    };

    const handleResetSickLeaves = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to reset sick leaves for this year?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reset it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.post('http://localhost:8080/api/leave/reset-sick-leaves');
                if (response.data.includes('Sick leaves have already been reset for this year.')) {
                    Swal.fire('Warning', response.data, 'warning');
                } else {
                    Swal.fire('Success', response.data, 'success');
                }
            } catch (error) {
                Swal.fire('Error', error.response?.data || 'Failed to reset sick leaves', 'error');
            }
        }
    };

    const filteredLeaves = leaves.filter(leave =>
        (leave.employeeId && leave.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (leave.employeeName && leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLeaves.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredLeaves.length / rowsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='table-card'>
            <div className="leave-management">
                <h2><i className="fas fa-calendar-alt"></i> Leave Management</h2>
                <div className="top-controls">
                    <div className="search-container">
                        <div className="search-box">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search by Employee ID or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    <div className="action-buttons-right">
                        <button onClick={handleCreditAnnualLeaves} className="action-btn">
                            Credit Annual Leaves
                        </button>
                        <button onClick={handleResetSickLeaves} className="action-btn">
                            Reset Sick Leaves
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: 'white' }} className="leave-table">
                        <thead>
                            <tr>
                                <th><i className="fas fa-id-badge"></i> Employee ID</th>
                                <th><i className="fas fa-user"></i> Employee Name</th>
                                <th><i className="fas fa-calendar-check"></i> Normal Leave Balance</th>
                                <th><i className="fas fa-calendar-plus"></i> Sick Leave Balance</th>
                                <th><i className="fas fa-calendar-plus"></i>Lop Count</th>
                                <th><i className="fas fa-cogs"></i> Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.employeeId}</td>
                                    <td>{leave.employeeName}</td>
                                    <td>{leave.leaveBalance?.normalLeaveBalance?.toFixed(1) || '0.0'}</td>
                                    <td>{leave.leaveBalance?.sickLeaveBalance?.toFixed(1) || '0.0'}</td>
                                    <td>{leave.leaveBalance?.lopCount?.toFixed(1) || '0.0'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEdit(leave)} className="action-btn edit-btn" title="Request Leave">
                                                <i className="fas fa-calendar-plus"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                )}
                {showForm && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{selectedLeave ? 'Edit Leave Request' : 'New Leave Request'}</h2>
                                <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="leave-form">

                                    {/* Employee ID (Non-Editable) */}
                                    <div className="form-row">
                                        <label>Employee ID</label>
                                        <input
                                            type="text"
                                            value={formData.employeeId}
                                            disabled // Makes the field non-editable
                                            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} // Greyed-out style
                                        />
                                    </div>

                                    {/* Employee Name (Non-Editable) */}
                                    <div className="form-row">
                                        <label>Employee Name</label>
                                        <input
                                            type="text"
                                            value={formData.employeeName}
                                            disabled // Makes the field non-editable
                                            style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} // Greyed-out style
                                        />
                                    </div>

                                    {/* Leave Type Dropdown */}
                                    <div className="form-row">
                                        <label>Leave Type</label>
                                        <select
                                            value={formData.leaveType}
                                            onChange={(e) => {
                                                const selectedType = e.target.value;
                                                setFormData({ ...formData, leaveType: selectedType });
                                            }}
                                        >
                                            <option value="Annual">
                                                Annual Leave ({formData.leaveBalance?.normalLeaveBalance || 0} days available)
                                            </option>
                                            <option value="Sick">
                                                Sick Leave ({formData.leaveBalance?.sickLeaveBalance || 0} days available)
                                            </option>
                                            <option value="LOP">Loss of Pay (LOP)</option>
                                        </select>
                                    </div>

                                    {/* Duration Dropdown */}
                                    <div className="form-row">
                                        <label>Duration</label>
                                        <select
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        >
                                            <option value="FULL_DAY">Full Day Leave</option>
                                            <option value="HALF_DAY_FIRST">Half Day - First Half</option>
                                            <option value="HALF_DAY_SECOND">Half Day - Second Half</option>
                                        </select>
                                    </div>

                                    {/* Number of Leaves */}
                                    <div className="form-row">
                                        <label>Number of Leaves</label>
                                        <input
                                            type="number"
                                            value={formData.noOfLeaves}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    noOfLeaves: value === "" ? "" : parseInt(value, 10) || 1
                                                });
                                            }}
                                            min="1"
                                            required
                                        />
                                    </div>

                                    {/* Conditional Rendering for Dates */}
                                    {formData.noOfLeaves > 1 ? (
                                        <>
                                            <div className="form-row">
                                                <label>Start Date</label>
                                                <CustomCalendar
                                                    value={formData.startDate}
                                                    onChange={(date) => setFormData({ ...formData, startDate: date })} // Pass the date directly
                                                    required
                                                />
                                            </div>
                                            <div className="form-row">
                                                <label>End Date</label>
                                                <CustomCalendar
                                                    value={formData.endDate}
                                                    onChange={(date) => setFormData({ ...formData, endDate: date })} // Pass the date directly
                                                    required
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="form-row">
                                            <label>Leave Date</label>
                                            <CustomCalendar
                                                value={formData.leaveDate}
                                                onChange={(date) => setFormData({ ...formData, leaveDate: date })} // Pass the date directly
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Reason for Leave */}
                                    <div className="form-row">
                                        <label>Reason</label>
                                        <textarea
                                            value={formData.reason}
                                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Form Actions */}
                                    <div className="form-actions">
                                        <button type="submit" className="submit-btn">
                                            {selectedLeave ? 'Update' : 'Submit'}
                                        </button>
                                        <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                                            Cancel
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default LeaveManagement;
