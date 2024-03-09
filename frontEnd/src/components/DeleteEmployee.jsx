import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function DeleteEmployee({ employee, setDeleteEmployeeVisibility, setEmployees }) {
  const [deleted, setDeleted] = useState(false);

  const handleDeleteEmployee = async () => {
    try {
      const response = await axios.delete(`http://localhost:8081/deleteEmployee/${employee.employee_ID}`);
      if (response.status === 200) {
        // Handle successful deletion
        console.log("Employee deleted successfully");
        // Update the list of employees
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.employee_ID !== employee.employee_ID));
        setDeleted(true);
      } else {
        // Handle other status codes
        console.error("Error deleting employee:", response.data);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      // Handle errors during deletion
    }
  };

  const handleCancel = () => {
    setDeleteEmployeeVisibility(null);
  };

  return (
    <div>
      <h1>Delete Employee</h1>
      {deleted ? (
        <p>Employee with Employee Number {employee.employeeNumber} has been deleted successfully.</p>
      ) : (
        <p>Are you sure you want to delete employee with Employee Number: {employee.employeeNumber}?</p>
      )}
      {!deleted && (
        <div>
          <button onClick={handleDeleteEmployee}>Delete</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}

DeleteEmployee.propTypes = {
  employee: PropTypes.shape({
    employee_ID: PropTypes.number.isRequired,
    employeeNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    // Add other employee properties here as needed
  }).isRequired,
  setDeleteEmployeeVisibility: PropTypes.func.isRequired,
  setEmployees: PropTypes.func.isRequired,
};

export default DeleteEmployee;