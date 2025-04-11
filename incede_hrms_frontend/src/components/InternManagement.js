import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./InternManagement.css";

function InternManagement() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const internsPerPage = 10;

  const [formData, setFormData] = useState({
    internId: "",
    fullName: "",
    department: "",
    status: "Paid", // Default to Paid
    joiningDate: "",
    birthDate:"",
    email: "",
    contactNo: "",
  });

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchInterns = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/interns");
      setInterns(response.data);
    } catch (error) {
      console.error("Error fetching interns:", error);
      Swal.fire("Error", "Failed to load interns", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Submitting Intern Data:", JSON.stringify(formData, null, 2)); // ✅ Log JSON to console
  
    try {
      let response;
      if (selectedIntern) {
        response = await axios.put(
          `http://localhost:8080/api/interns/${formData.id}`, // Pass the correct ID
          formData
        );
      } else {
        response = await axios.post("http://localhost:8080/api/interns", formData);
      }
  
      if (response.data) {
        fetchInterns();
        Swal.fire({
          icon: "success",
          title: selectedIntern ? "Intern Updated!" : "Intern Added!",
          showConfirmButton: false,
          timer: 1500,
        });
  
        // Reset form after submission
        setFormData({
          id: "",
          internId: "",
          fullName: "",
          department: "",
          status: "Paid",
          joiningDate: "",
          birthDate:"",
          email: "",
          contactNo: "",
        });
  
        setSelectedIntern(null);
      }
    } catch (error) {
      console.error("Error saving intern:", error);
      Swal.fire("Error!", "Failed to save intern.", "error");
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleEdit = (intern) => {
    setSelectedIntern(intern);
    setFormData({
      id:intern.id,
      internId: intern.internId,
      fullName: intern.fullName,
      department: intern.department,
      status: intern.status,
      joiningDate: intern.joiningDate,
      birthDate:intern.birthDate,
      email: intern.email,
      contactNo: intern.contactNo,
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/interns/${id}`);
        fetchInterns();
        Swal.fire("Deleted!", "Intern has been removed.", "success");
      } catch (error) {
        console.error("Error deleting intern:", error);
        Swal.fire("Error!", "Failed to delete intern.", "error");
      }
    }
  };

  // ** Pagination Logic **
  const indexOfLastIntern = currentPage * internsPerPage;
  const indexOfFirstIntern = indexOfLastIntern - internsPerPage;
  const currentInterns = interns.slice(indexOfFirstIntern, indexOfLastIntern);
  const totalPages = Math.ceil(interns.length / internsPerPage);

  return (
    <div className="intern-management">
      <div className="intern-management-container">
        {/* Left Side - Registration Form */}
        <div className="form-section">
          <div className="form-card">
            <h2>{selectedIntern ? "Edit Intern" : "Register Intern"}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="internId" placeholder="Intern ID" value={formData.internId} onChange={handleChange} required />
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              <input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
              
              {/* Radio Buttons for Paid / Unpaid */}
              {/* Radio Buttons for Paid / Unpaid */}
              <div className="radio-group">
                {/* <label className="radio-label">Intern Type:</label> */}

                <label className="radio-option">
                  <input 
                    type="radio" 
                    id="paid" 
                    name="status" 
                    value="Paid" 
                    checked={formData.status === "Paid"} 
                    onChange={handleChange} 
                  />
                  <span className="custom-radio"></span>
                  Paid
                </label>

                <label className="radio-option">
                  <input 
                    type="radio" 
                    id="unpaid" 
                    name="status" 
                    value="Unpaid" 
                    checked={formData.status === "Unpaid"} 
                    onChange={handleChange} 
                  />
                  <span className="custom-radio"></span>
                  Unpaid
                </label>
              </div>
{/* 
              <label style={FontFace}>Joining Date</label> <br></br>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required /> <br></br> */}
              <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px", display: "block" }}>
                Joining Date
              </label>
              <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />

              {/* <label>Birth Date</label> <br></br>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required /> */}
              <label style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px", display: "block" }}>
                Birth Date
              </label>
              <input 
                type="date" 
                name="birthDate" 
                value={formData.birthDate} 
                onChange={handleChange} 
                required 
              />

              
              
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="tel" name="contactNo" placeholder="Contact No" value={formData.contactNo} onChange={handleChange} required />
              <button type="submit">{selectedIntern ? "Update Intern" : "Add Intern"}</button>
            </form>
          </div>
        </div>


        

        {/* Right Side - Intern List in a Card */}
        <div className="table-section">
          <div className="table-card">
            <h2>Interns List</h2>
            <table className="intern-table">
              <thead>
                <tr>
                  <th>Intern ID</th>
                  <th>Full Name</th>
                  {/* <th>Department</th> */}
                  {/* <th>Status</th> */}
                  <th>Joining Date</th>
                  <th>Email</th>
                  <th>Contact No</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInterns.map((intern) => (
                  <tr key={intern.id}>
                    <td>{intern.internId}</td>
                    <td>{intern.fullName}</td>
                    {/* <td>{intern.department}</td> */}
                    {/* <td>{intern.status}</td> */}
                    <td>{formatDate(intern.joiningDate)}</td>
                    <td>{intern.email}</td>
                    <td>{intern.contactNo}</td>
                    <td>
                        <div className="action-buttons">
                        <button className="edit-btn" onClick={() => handleEdit(intern)}><i className="fas fa-edit"></i></button>
                        <button className="delete-btn" onClick={() => handleDelete(intern.id)}><i className="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="page-btn">Previous</button>
              <span> Page {currentPage} of {totalPages} </span>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="page-btn">Next</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default InternManagement;
