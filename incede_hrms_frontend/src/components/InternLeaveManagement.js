import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./InternLeaveManagement.css";

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
        leaveDate:"",
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

            //  

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
            leaveDate:"",
            startDate: "",
            endDate: "",
            reason: "",
            noOfLeaves: 1,
            isHalfDay: false,
        });
        setShowForm(true);
    };

    // Submit leave request
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const leaveData = {
    //         internId: formData.internId,
    //         leaveType: formData.leaveType.toUpperCase(),
    //         duration: formData.duration,
    //         startDate: formData.startDate,
    //         endDate: formData.endDate,
    //         noOfLeaves: formData.noOfLeaves,
    //         leaveDate:formData.leaveDate,
    //         isHalfDay: formData.duration.includes("HALF_DAY"),
    //         reason: formData.reason,
    //     };

    //     try {
    //         await axios.post("http://192.168.1.22:8080/api/intern-leave/apply", leaveData);

    //         Swal.fire("Success", "Leave marked successfully", "success");
    //         setShowForm(false);
    //         fetchInterns();
    //     } catch (error) {
    //         console.error("Error submitting leave request:", error);
    //         Swal.fire("Error", "Failed to mark leave", "error");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const leaveData = {
            internId: formData.internId,
            leaveType: formData.leaveType.toUpperCase(),
            duration: formData.duration,
            startDate: formData.startDate ? formData.startDate : null,
            endDate: formData.endDate ? formData.endDate : null,
            leaveDate:formData.leaveDate ? formData.leaveDate:null,
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
                                {/* <th>Leave Balance</th> */}
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
                                    {/* <td>{intern.leaveBalance}</td> */}
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
                            onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Employee Name</label>
                        <input
                            type="text"
                            value={formData.internName}
                            onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <label>Leave Type</label>
                        <select
                            value={formData.leaveType}
                            onChange={(e) => setFormData({...formData, leaveType: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        >
                            <option value="FULL_DAY">Full Day Leave</option>
                            <option value="HALF_DAY_FIRST">Half Day - First Half</option>
                            <option value="HALF_DAY_SECOND">Half Day - Second Half</option>
            
                        </select>
                    </div>


                    {/* <div className="form-row">
                        <label>Loss of Pay (LOP)</label>
                        <input
                            type="checkbox"
                            checked={formData.isLop}
                            onChange={(e) => setFormData({...formData, isLop: e.target.checked})}
                        />
                    </div> */}

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
                            <div className="form-row">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <div className="form-row">
                            <label>Leave Date</label>
                            <input
                                type="date"
                                value={formData.leaveDate}
                                onChange={(e) => setFormData({...formData, leaveDate: e.target.value})}
                                required
                            />
                        </div>
                    )}

                    <div className="form-row">
                        <label>Reason</label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
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



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import './InternLeaveManagement.css';

// const InternLeaveManagement = () => {
//     const [leaves, setLeaves] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [selectedLeave, setSelectedLeave] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const rowsPerPage = 6;

//     const [formData, setFormData] = useState({
//         internId: "",
//         internName: "",
//         leaveType: "Annual",
//         startDate: "",
//         endDate: "",
//         reason: "",
//         noOfLeaves: 1,
//         isHalfDay: false,
//     });

//     useEffect(() => {
//         fetchInternLeaves();
//     }, []);

//     const fetchInternLeaves = async () => {
//         try {
//             const internsResponse = await axios.get("http://192.168.1.22:8080/api/interns");
//             const interns = internsResponse.data;

//             const internsWithLeaveBalance = await Promise.all(
//                 interns.map(async (intern) => {
//                     try {
//                         const leaveBalanceResponse = await axios.get(`http://192.168.1.22:8080/api/intern-leave/${intern.internId}`);
//                         return {
//                             ...intern,
//                             leaveBalance: leaveBalanceResponse.data || [],
//                         };
//                     } catch (error) {
//                         console.error(`Error fetching leave balance for ${intern.internId}:`, error);
//                         return { ...intern, leaveBalance: [] };
//                     }
//                 })
//             );

//             setLeaves(internsWithLeaveBalance);
//         } catch (error) {
//             console.error("Error fetching intern leaves:", error);
//             Swal.fire("Error", "Failed to fetch leave records", "error");
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const leaveData = {
//             internId: formData.internId,
//             leaveType: formData.leaveType.toUpperCase(),
//             startDate: formData.startDate,
//             endDate: formData.endDate,
//             noOfLeaves: formData.noOfLeaves,
//             isHalfDay: formData.isHalfDay,
//             reason: formData.reason,
//         };

//         console.log("Submitting Leave Request:", leaveData);

//         try {
//             if (selectedLeave) {
//                 await axios.put(`http://192.168.1.22:8080/api/intern-leave/${selectedLeave.id}`, leaveData);
//             } else {
//                 await axios.post("http://192.168.1.22:8080/api/intern-leave/apply", leaveData);
//             }

//             Swal.fire("Success", "Leave request submitted successfully", "success");
//             setShowForm(false);
//             setSelectedLeave(null);
//             resetForm();
//             fetchInternLeaves();
//         } catch (error) {
//             console.error("Error submitting leave request:", error);
//             Swal.fire("Error", "Failed to submit leave request", "error");
//         }
//     };

//     const handleEdit = (leave) => {
//         setSelectedLeave(leave);
//         setFormData({
//             internId: leave.internId,
//             internName: leave.fullName,
//             leaveType: leave.leaveType || "Annual",
//             startDate: leave.startDate,
//             endDate: leave.endDate,
//             noOfLeaves: leave.noOfLeaves || 1,
//             isHalfDay: leave.isHalfDay || false,
//             reason: leave.reason || "",
//         });
//         setShowForm(true);
//     };

//     const handleDelete = async (id) => {
//         try {
//             const result = await Swal.fire({
//                 title: "Are you sure?",
//                 text: "This action cannot be undone!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonColor: "#d33",
//                 cancelButtonColor: "#3085d6",
//                 confirmButtonText: "Yes, delete it!",
//             });

//             if (result.isConfirmed) {
//                 await axios.delete(`http://192.168.1.22:8080/api/intern-leave/${id}`);
//                 Swal.fire("Deleted!", "Leave request has been deleted.", "success");
//                 fetchInternLeaves();
//             }
//         } catch (error) {
//             console.error("Error deleting leave request:", error);
//             Swal.fire("Error", "Failed to delete leave request", "error");
//         }
//     };

//     const resetForm = () => {
//         setFormData({
//             internId: "",
//             internName: "",
//             leaveType: "Annual",
//             startDate: "",
//             endDate: "",
//             noOfLeaves: 1,
//             isHalfDay: false,
//             reason: "",
//         });
//     };

//     const filteredLeaves = leaves.filter(
//         (leave) =>
//             (leave.internId && leave.internId.toLowerCase().includes(searchTerm.toLowerCase())) ||
//             (leave.fullName && leave.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     const indexOfLastRow = currentPage * rowsPerPage;
//     const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//     const currentRows = filteredLeaves.slice(indexOfFirstRow, indexOfLastRow);
//     const totalPages = Math.ceil(filteredLeaves.length / rowsPerPage);

//     const paginate = (pageNumber) => setCurrentPage(pageNumber);

//     return (
//         <div className="table-card">
//             <div className="intern-leave-management">
//                 <h2><i className="fas fa-calendar-alt"></i> Intern Leave Management</h2>

//                 <div className="top-controls">
//                     <input
//                         type="text"
//                         placeholder="Search by Intern ID or Name..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="search-input"
//                     />
//                     <button className="add-btn" onClick={() => { setShowForm(true); setSelectedLeave(null); resetForm(); }}>
//                         <i className="fas fa-plus"></i> New Leave Request
//                     </button>
//                 </div>

//                 <div className="table-responsive">
//                     <table className="leave-table">
//                         <thead>
//                             <tr>
//                                 <th>Intern ID</th>
//                                 <th>Intern Name</th>
//                                 <th>Department</th>
//                                 <th>Status</th>
//                                 <th>Joining Date</th>
//                                 <th>Leave Count</th>
//                                 <th>LOP Count</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {currentRows.map((intern) => (
//                                 <tr key={intern.id}>
//                                     <td>{intern.internId}</td>
//                                     <td>{intern.fullName}</td>
//                                     <td>{intern.department}</td>
//                                     <td>{intern.status}</td>
//                                     <td>{intern.joiningDate}</td>
//                                     <td>{intern.leaveBalance}</td>
//                                     <td>{intern.lopCount}</td>
//                                     <td>
//                                         <button onClick={() => handleEdit(intern)} className="action-btn edit-btn">Edit</button>
//                                         <button onClick={() => handleDelete(intern.id)} className="action-btn delete-btn">Delete</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {totalPages > 1 && (
//                     <div className="pagination">
//                         <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="page-btn">
//                             <i className="fas fa-chevron-left"></i>
//                         </button>
//                         {[...Array(totalPages)].map((_, index) => (
//                             <button key={index + 1} onClick={() => paginate(index + 1)}
//                                 className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}>
//                                 {index + 1}
//                             </button>
//                         ))}
//                         <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">
//                             <i className="fas fa-chevron-right"></i>
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default InternLeaveManagement;

