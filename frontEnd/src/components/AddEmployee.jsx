// addemployee.jsx
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import PersonalInput from "./PersonalInput";
import AddressInput from './AddressInput.jsx';
import WorkInput from './WorkInput.jsx';
import DefaultButton from "./UI/DefaultButton.jsx";

function AddEmployee({ setAddEmployeeVisibility, setEmployees }) {
    const [personal, setPersonal] = useState({
        employeeNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        contactInformation: ""
    });

    const [address, setAddress] = useState({
        HouseNumber: "",
        Street: "",
        Barangay: "",
        City: "",
        Province: "",
        Country: "",
        ZIPcode: ""
    });

    const [selectedEmployeeType, setSelectedEmployeeType] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const handleCancel = () => {
        setAddEmployeeVisibility(false);
    }

    const handleAddEmployee = async () => {
        console.log("Personal Object:", personal); // Display personal object to the console
        console.log("Address Object:", address);
            const work = {
            employeeType: selectedEmployeeType,
            designationName: selectedDesignation,
            departmentName: selectedDepartment
        }
        const employee = {
          ...personal,
          ...address,
          ...work
        };
      
        try {
          const response = await axios.post('http://localhost:8081/addEmployee', employee); // Replace `/api/employees` with your actual endpoint
          if (response.status === 201) { // Check for successful creation (status code 201)
            setEmployees(prevEmployees => [...prevEmployees, employee]);
            setAddEmployeeVisibility(false);
          } else {
            console.error("Error adding employee:", response.data);
            // Handle any other error cases
          }
        } catch (error) {
          console.error("Error adding employee:", error);
          // Handle errors during API call
        }
      };

    return (
        <div>
            <div className="add-employee-container">
                <h1>Add Employee</h1>
                <PersonalInput onPersonalChange={setPersonal} />
                <AddressInput onAddressChange={setAddress}></AddressInput>
                <WorkInput onTypeChange={setSelectedEmployeeType} onDesignationChange={setSelectedDesignation} onDepartmentChange={setSelectedDepartment}></WorkInput>
                <div onClick={handleAddEmployee}>
                    <DefaultButton label="Add Employee"></DefaultButton>
                </div>
                <div onClick={handleCancel}>
                    <DefaultButton label="Cancel"></DefaultButton>
                </div>
            </div>
        </div>
    )
}

AddEmployee.propTypes = {
    setAddEmployeeVisibility: PropTypes.func.isRequired,
};

export default AddEmployee;
