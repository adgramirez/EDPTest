import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import DefaultButton from './UI/DefaultButton';

function EmployeeTable({ employees, setEmployees, addEmployeeVisibility, setAddEmployeeVisibility, editEmployeeVisibility, setEditEmployeeVisibility, setDeleteEmployeeVisibility }) {
    const handleAdd = () => {
        setAddEmployeeVisibility(true);
    };

    const handleDelete = async (employee_ID) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await axios.delete(`http://localhost:8081/deleteEmployee/${employee_ID}`);
                if (response.status === 200) {
                    // Handle successful deletion
                    console.log("Employee deleted successfully");
                    // Update the list of employees
                    setEmployees(prevEmployees => prevEmployees.filter(emp => emp.employee_ID !== employee_ID));
                } else {
                    // Handle other status codes
                    console.error("Error deleting employee:", response.data);
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
                // Handle errors during deletion
            }
        }
    };


    
    return (
        <div>
            <table className="border-black border border-solid border-collapse">
                <thead>
                    <tr>
                        <th className="border-black border border-solid border-collapse">Employee No.</th>
                        <th className="border-black border border-solid border-collapse">Name</th>
                        <th className="border-black border border-solid border-collapse">Contact</th>
                        <th className="border-black border border-solid border-collapse">Address</th>
                        <th className="border-black border border-solid border-collapse">Designation</th>
                        <th className="border-black border border-solid border-collapse">Employee Type</th>
                        <th className="border-black border border-solid border-collapse">Department</th>
                        <th className="border-black border border-solid border-collapse">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length > 0 ? (
                        employees.map((employee, index) => (
                            <tr key={index}>
                                <td>{employee.employeeNumber}</td>
                                <td>{employee.firstName + " " + employee.middleName + " " + employee.lastName}</td>
                                <td>{employee.contactInformation}</td>
                                <td>{employee.HouseNumber + ', ' + employee.Street + ', ' + employee.Barangay + ', ' + employee.City + ', ' + employee.Province + ', ' + employee.Country + ', ' + employee.ZIPcode}</td>
                                <td>{employee.designationName}</td>
                                <td>{employee.employeeType}</td>
                                <td>{employee.departmentName}</td>
                                <td>
                                    <div className='edit-delete-buttons'>
                                        <button className='edit-button' onClick={() => setEditEmployeeVisibility({ visibility: true, index: index })}>Edit Details</button>
                                        <button className='delete-button' onClick={() => handleDelete(employee.employee_ID)}>Remove Employee</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td id="empty-list-label" colSpan={9} className="border-black border border-solid border-collapse">No employees found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className='add-button-container' onClick={handleAdd}>
                {!addEmployeeVisibility && <DefaultButton label="Add New Employee"></DefaultButton>}
            </div>

        </div>

    );
}

EmployeeTable.propTypes = {
    employees: PropTypes.arrayOf(
        PropTypes.shape({
            employee_ID: PropTypes.number.isRequired, // Assuming employeeId is the unique identifier
            employeeNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
            contact: PropTypes.string.isRequired,
            houseNumber: PropTypes.string.isRequired,
            street: PropTypes.string.isRequired,
            barangay: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            province: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            zipcode: PropTypes.string.isRequired,
            designation: PropTypes.string.isRequired,
            employeeType: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            department: PropTypes.string.isRequired,
        })
    ).isRequired,
    setEmployees: PropTypes.func.isRequired,
    addEmployeeVisibility: PropTypes.bool.isRequired,
    setAddEmployeeVisibility: PropTypes.func.isRequired,
    setDeleteEmployeeVisibility: PropTypes.func.isRequired,
    setEditEmployeeVisibility: PropTypes.func.isRequired,
};

export default EmployeeTable;
