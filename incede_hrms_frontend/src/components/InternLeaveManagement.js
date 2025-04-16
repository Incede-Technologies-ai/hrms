import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./InternLeaveManagement.css";
import CustomCalendar from "./CustomCalendar"; // Import the custom calendar component

const InternLeaveManagement = () => {
    const [interns, setInterns] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIntern, setSelectedIntern] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const rowsPerPage = 6;

    const [formData, setFormData] = useState({
        internId: "",
        internName: "",
        leaveType: "Annual",
        duration: "FULL_DAY",
        leaveDate: "",
        startDate: "",
        endDate: "",
        reason: "",
        noOfLeaves: 1,
        isHalfDay: false,
    });

    useEffect(() => {
        fetchInterns();
    }, []);

    // Fetch interns and their leave balance
    const fetchInterns = async () => {
        try {
            const internsResponse = await axios.get("http://localhost:8080/api/interns");
            const interns = internsResponse.data;

            setInterns(interns);
        } catch (error) {
            console.error("Error fetching interns:", error);
            Swal.fire("Error", "Failed to fetch intern records", "error");
        }
    };

    // Open leave form for selected intern
    const handleMarkLeave = (intern) => {
        setSelectedIntern(intern);
        console.log(intern);
        setFormData({
            internId: intern.internId,
            internName: intern.fullName,
            leaveType: "Annual",
            duration: "FULL_DAY",
            leaveDate: "",
            startDate: "",
            endDate: "",
            reason: "",
            noOfLeaves: 1,
            isHalfDay: false,
        });
        setShowForm(true);
    };

    // Submit leave request
    const handleSubmit = async (e) => {
        e.preventDefault();

        const leaveData = {
            internId: formData.internId,
            leaveType: formData.leaveType.toUpperCase(),
            duration: formData.duration,
            startDate: formData.startDate ? formData.startDate : null,
            endDate: formData.endDate ? formData.endDate : null,
            leaveDate: formData.leaveDate ? formData.leaveDate : null,
            noOfLeaves: formData.noOfLeaves,
            isHalfDay: formData.duration.includes("HALF_DAY"),
            reason: formData.reason,
        };

        // 🔹 Log the request data before sending
        console.log("Submitting Leave Request:", leaveData);

        try {
            const response = await axios.post("http://localhost:8080/api/intern-leave/apply", leaveData);
            console.log("Response from server:", response.data);

            Swal.fire("Success", "Leave marked successfully", "success");
            setShowForm(false);
            fetchInterns();
        } catch (error) {
            console.error("Error submitting leave request:", error.response ? error.response.data : error.message);
            Swal.fire("Error", `Failed to mark leave: ${error.response ? error.response.data.message : error.message}`, "error");
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            internId: "",
            internName: "",
            leaveType: "Annual",
            duration: "FULL_DAY",
            startDate: "",
            endDate: "",
            reason: "",
            noOfLeaves: 1,
            isHalfDay: false,
        });
    };

    // Handle date change for custom calendar
    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    };

    // Pagination
    const filteredInterns = interns.filter(
        (intern) =>
            (intern.internId && intern.internId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (intern.fullName && intern.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredInterns.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(filteredInterns.length / rowsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="table-card">
            <div className="intern-leave-management">
                <h2><i className="fas fa-calendar-alt"></i> Intern Leave Management</h2>

                <div className="top-controls">
                    <input
                        type="text"
                        placeholder="Search by Intern ID or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="table-responsive">
                    <table className="leave-table">
                        <thead>
                            <tr>
                                <th>Intern ID</th>
                                <th>Intern Name</th>
                                <th>Department</th>
                                <th>Status</th>
                                <th>Joining Date</th>
                                <th>LOP Count</th>
                                <th>Mark Leave</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows.map((intern) => (
                                <tr key={intern.id}>
                                    <td>{intern.internId}</td>
                                    <td>{intern.fullName}</td>
                                    <td>{intern.department}</td>
                                    <td>{intern.status}</td>
                                    <td>{intern.joiningDate}</td>
                                    <td>{intern.lopCount}</td>
                                    <td>
                                        <button onClick={() => handleMarkLeave(intern)} className="action-btn mark-btn">
                                            <i className="fas fa-calendar-plus"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-btn">
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}>
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedIntern ? 'Edit Leave Request' : 'New Leave Request'}</h2>
                            <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="leave-form">

                                <div className="form-row">
                                    <label>Employee ID</label>
                                    <input
                                        type="text"
                                        value={formData.internId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Employee Name</label>
                                    <input
                                        type="text"
                                        value={formData.internName}
                                        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <label>Leave Type</label>
                                    <select
                                        value={formData.leaveType}
                                        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                    >
                                        <option value="Annual">Annual Leave</option>
                                        <option value="Sick">Sick Leave</option>
                                        <option value="LOP">Loss of Pay (LOP)</option>
                                    </select>
                                </div>

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

                                {/* Conditional Rendering */}
                                {formData.noOfLeaves > 1 ? (
                                    <>
                                        <div className="form-row1">
                                            <label>Start Date</label>
                                            <CustomCalendar
                                                value={formData.startDate}
                                                onChange={(date) => handleDateChange("startDate", date)}
                                            />
                                        </div>
                                        <div className="form-row1">
                                            <label>End Date</label>
                                            <CustomCalendar
                                                value={formData.endDate}
                                                onChange={(date) => handleDateChange("endDate", date)}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="form-row1">
                                        <label>Leave Date</label>
                                        <CustomCalendar
                                            value={formData.leaveDate}
                                            onChange={(date) => handleDateChange("leaveDate", date)}
                                        />
                                    </div>
                                )}

                                <div className="form-row">
                                    <label>Reason</label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">
                                        {selectedIntern ? 'Update' : 'Submit'}
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
    );
};

export default InternLeaveManagement;

