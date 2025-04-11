import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EmployeeForm.css";
import CustomCalendar from "./CustomCalendar"; // Import the updated CustomCalendar component

function EmployeeForm({ employee, isEdit, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    designation: "",
    department: "",
    joiningDate: "",
    officialEmail: "",
    dateOfBirth: "",
    contactNo: "",
    personalEmail: "",
  });

  useEffect(() => {
    if (employee && isEdit) {
      setFormData({
        employeeId: employee.employeeId || "",
        fullName: employee.fullName || "",
        designation: employee.designation || "",
        department: employee.department || "",
        joiningDate: employee.joiningDate || "",
        officialEmail: employee.officialEmail || "",
        dateOfBirth: employee.dateOfBirth || "",
        contactNo: employee.contactNo || "",
        personalEmail: employee.personalEmail || "",
      });
    }
  }, [employee, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value, // Update the date field with the formatted date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isEdit) {
        response = await axios.put(
          `http://localhost:8080/api/employees/${employee.id}`,
          formData
        );
      } else {
        response = await axios.post(
          "http://localhost:8080/api/employees",
          formData
        );
      }

      if (response.data && response.data.message) {
        if (onSuccess) {
          onSuccess();
        }

        setFormData({
          employeeId: "",
          fullName: "",
          designation: "",
          department: "",
          joiningDate: "",
          officialEmail: "",
          dateOfBirth: "",
          contactNo: "",
          personalEmail: "",
        });

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: isEdit
            ? "Employee updated successfully!"
            : "Employee added successfully!",
          showConfirmButton: false,
          timer: 1500,
        });

        if (onClose) {
          onClose();
        }
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      Swal.fire("Error!", "Failed to save employee.", "error");
    }
  };

  const renderField = (label, name, type, placeholder = "") => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {type === "date" ? (
        <CustomCalendar
          value={formData[name]}
          onChange={(value) => handleDateChange(name, value)}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required
          className="form-control"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {renderField("Employee ID", "employeeId", "text", "Enter employee ID")}
            {renderField("Full Name", "fullName", "text", "Enter full name")}
          </div>

          <div className="form-row">
            {renderField("Designation", "designation", "text", "Enter designation")}
            {renderField("Department", "department", "text", "Enter department")}
          </div>

          <div className="form-row">
            {renderField("Joining Date", "joiningDate", "date")} 
            {renderField("Date of Birth", "dateOfBirth", "date")} 
          </div>

          <div className="form-row">
            {renderField("Official Email", "officialEmail", "email", "Enter official email")}
            {renderField("Personal Email", "personalEmail", "email", "Enter personal email")}
          </div>

          <div className="form-row">
            {renderField("Contact No", "contactNo", "tel", "Enter contact number")}
            {renderField("Alternate No", "alternateNo", "tel", "Enter alternate number")}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {isEdit ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;