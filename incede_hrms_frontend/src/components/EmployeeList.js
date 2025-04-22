import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './EmployeeList.css';

const EmployeeList = forwardRef(({ onEditEmployee }, ref) => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    fetchEmployees();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchEmployees, // Expose fetchEmployees method
    refreshList: () => {
      fetchEmployees();
    }
  }));

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/employees');
      console.log(response);

      const sortedEmployees = response.data.sort((a, b) => a.employeeId.localeCompare(b.employeeId));
      console.log(sortedEmployees);

      setEmployees(sortedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  
  const handleSoftDelete = async (employeeId) => {
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
        await axios.put(`http://localhost:8080/api/employees/${employeeId}/soft-delete`);
        fetchEmployees();
          Swal.fire(
          'Deleted!',
          'Employee has been deleted.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      Swal.fire(
        'Error!',
        'Failed to delete employee.',
        'error'
      );
    }
  };


  const filteredEmployees = employees.filter(employee => 
    (employee.employeeId && employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (employee.fullName && employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
     <div className="employee-list">
      <h2><i className="fas fa-users"></i> Employee List</h2>
      
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

      <div className="table-responsive">
        <table style={{ borderRadius: '15px', overflow: 'hidden', backgroundColor: 'white' }} className="employee-table">
          <thead>
            <tr>
              <th><i className="fas fa-id-badge"></i> Employee ID</th>
              <th><i className="fas fa-user"></i> Full Name</th>
              <th><i className="fas fa-briefcase"></i> Designation</th>
              <th><i className="fas fa-building"></i> Department</th>
              <th><i className="fas fa-calendar-alt"></i> Joining Date</th>
              <th><i className="fas fa-envelope"></i> Email</th>
              <th><i className="fas fa-phone-alt"></i> Contact</th>
              <th><i className="fas fa-phone-alt"></i> Emergency Contact</th>
              <th><i className="fas fa-cogs"></i> Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.employeeId}</td>
                <td>{employee.fullName}</td>
                <td>{employee.designation}</td>
                <td>{employee.department}</td>
                <td>{formatDate(employee.joiningDate)}</td>
                <td>{employee.officialEmail}</td>
                <td>{employee.contactNo}</td>
                <td>{employee.emergencyContact || "N/A"}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEditEmployee(employee)}
                      className="action-btn edit-btn"
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleSoftDelete(employee.employeeId)}
                      className="action-btn delete-btn"
                      title="Delete"
                    >
                      <i className="fas fa-trash-alt"></i>
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
    </div>  
  );
});

export default EmployeeList;
