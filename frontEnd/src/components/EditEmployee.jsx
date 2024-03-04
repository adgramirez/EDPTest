
import PropTypes from 'prop-types';
import { useState } from 'react';
import PersonalInput from "./PersonalInput";
import AddressInput from './AddressInput.jsx';
import WorkInput from './WorkInput.jsx';
import DefaultButton from "./UI/DefaultButton.jsx";

function EditEmployee({ setEditEmployeeVisibility, setEmployees }) {
    const [personal, setPersonal] = useState({
        employeeNumber: "",
        firstName: "",
        middleName: "",
        lastName: "",
        contactInformation: ""
    });

    const [address, setAddress] = useState({
        houseNumber: "",
        street: "",
        barangay: "",
        city: "",
        province: "",
        country: "",
        zipcode: ""
    });

    const [selectedEmployeeType, setSelectedEmployeeType] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const handleCancel = () => {
        setEditEmployeeVisibility(false);
    }

    const handleAddEmployee = () => {
        console.log("Personal Object:", personal); // Display personal object to the console
        console.log("Address Object:", address);
        const work = {
            employeeType: selectedEmployeeType,
            designationName: selectedDesignation,
            departmentName: selectedDepartment
        }
        console.log("Work Object:", work)

        const employee = {
            ...personal,
            ...address,
            ...work
        };

        setEmployees(prevEmployees => [...prevEmployees, employee]);
        setEditEmployeeVisibility(false);
    }

    return (
        <div>
            <div className="add-employee-container">
                <PersonalInput onPersonalChange={setPersonal} />
                <AddressInput onAddressChange={setAddress}></AddressInput>
                <WorkInput onTypeChange={setSelectedEmployeeType} onDesignationChange={setSelectedDesignation} onDepartmentChange={setSelectedDepartment}></WorkInput>
                <div onClick={handleAddEmployee}>
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
