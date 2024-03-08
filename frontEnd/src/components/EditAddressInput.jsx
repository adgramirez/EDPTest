import PropTypes from 'prop-types';
import { useState } from 'react';
import EditPersonalInput from "./EditPersonalInput.jsx";
import EditAddressInput from './EditAddressInput.jsx';
import WorkInput from './WorkInput.jsx';
import DefaultButton from "./UI/DefaultButton.jsx";

function EditEmployee({ editEmployeeVisibility, setEditEmployeeVisibility, setEmployees, employees}) {
    const employee = employees[editEmployeeVisibility.index] //stores the employee object. but it should be passed to the individual input boxes

    const [personal, setPersonal] = useState({
        employeeNumber: employee.employeeNumber,
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        contactInformation: employee.contactInformation
    });

    const [address, setAddress] = useState({
        houseNumber: employee.HouseNumber,
        street: employee.Street,
        barangay: employee.Barangay,
        city: employee.City,
        province: employee.Province,
        country: employee.Country,
        zipcode: employee.ZIPcode
    });

    const [selectedEmployeeType, setSelectedEmployeeType] = useState(employee.employeeType);
    const [selectedDesignation, setSelectedDesignation] = useState(employee.designationName);
    const [selectedDepartment, setSelectedDepartment] = useState(employee.departmentName);

    const handleCancel = () => {
        setEditEmployeeVisibility({visibility: false, index: -1});
    }

    const handleEditEmployee = () => {
        console.log("Personal Object:", personal); // Display personal object to the console
        console.log("Address Object:", address);
        const work = {
            employeeType: selectedEmployeeType,
            designationName: selectedDesignation,
            departmentName: selectedDepartment
        }
        console.log("Work Object:", work)
    
        const updatedEmployee = {
            ...personal,
            ...address,
            ...work,
            departmentName: selectedDepartment !== employee.departmentName ? selectedDepartment : employee.departmentName
        };
    
        const updatedEmployees = [...employees]; // Create a copy of the employees array
        updatedEmployees[editEmployeeVisibility.index] = updatedEmployee; // Update the existing employee
    
        setEmployees(updatedEmployees); // Update the state with the modified employees array
        setEditEmployeeVisibility({visibility: false, index: -1}); // Hide the edit form
    }
    
    return (
        <div>
            <div className="add-employee-container">
                <h1>Edit Employee</h1>
                <EditPersonalInput onPersonalChange={setPersonal} employee={employee}/>
                <EditAddressInput onAddressChange={setAddress} employee={employee}/>
                <WorkInput onTypeChange={setSelectedEmployeeType} onDesignationChange={setSelectedDesignation} onDepartmentChange={setSelectedDepartment}/>
                <div onClick={handleEditEmployee}>
                    <DefaultButton label="Done"></DefaultButton>
                </div>
                <div onClick={handleCancel}>
                    <DefaultButton label="Cancel"></DefaultButton>
                </div>
            </div>
        </div>
    )
}

EditEmployee.propTypes = {
    setEditEmployeeVisibility: PropTypes.func.isRequired,
};

export default EditEmployee;