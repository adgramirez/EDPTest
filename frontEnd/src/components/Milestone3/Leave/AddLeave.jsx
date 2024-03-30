//partially edited

import PropTypes from 'prop-types';
import InputDate from '../../UI/InputDate';
import DefaultButton from '../../UI/DefaultButton';
import { useState } from 'react';
import axios from 'axios';

function AddLeave({ setLeaves, employee, onEmployeeChange, type, onTypeChange, superior, onSuperiorChange, status, onStatusChange, setRequestLeaveVisibility, employees, superiors, leaveTypes, leaveStatuses }) {
    //dropdown
    const handleSelectChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'employee':
                onEmployeeChange(value);
                break;
            case 'leaveType':
                onTypeChange(value);
                break;
            case 'superior':
                onSuperiorChange(value);
                break;
            case 'status':
                onStatusChange(value);
                break;
            default:
                break;
        }
    };

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartChange = (e) => {
        setStartDate(e.target.value)
    };

    const handleEndChange = (e) => {
        setEndDate(e.target.value)
    };

    const handleCancel = () => {
        setRequestLeaveVisibility(false);
    }

    const handleRequestLeave = async () => {
        const leave = {
            emp: employees[employee],
            sup: superiors[superior],
            lv: {
                employeeIndex: employee,
                superiorIndex: superior,
                startDate: startDate,
                endDate: endDate,
                leaveType: type,
                leaveStatus: status
            }
        }

        console.log("Leave Object:", leave);
        
        try {
          const response = await axios.post('http://localhost:8081/addLeave', leave); 
          if (response.status === 201) { 
            setLeaves(prevLeaves => [...prevLeaves, leave]);
            setRequestLeaveVisibility(false);
          } else {
            console.error("Error adding leave:", response.data);
          }
        } catch (error) {
          console.error("Error adding leave:", error);
        }
      };

    return (
        <div className="add-employee-container">
            <h1>
                Request Leave
            </h1>

            <div className="flex left-align">
            <div>
                <p>(Employee Name)</p>
                <select id="employee" onChange={handleSelectChange}>
                    <option value="-1">Choose</option>
                    {employees.map((employee, index) => (
                        <option key={index} value={index}>{employee.firstName + " " + employee.middleName + " " + employee.lastName}</option>
                    ))}
                </select>
            </div>

            <div>
                <p>(Start Date)</p>
                <InputDate onChange={(e) => handleStartChange(e)}/>
            </div>

            <div>
                <p>(End Date)</p>
                <InputDate onChange={(e) => handleEndChange(e)}/>
            </div>
            
            <div>
                <p>(Leave Type)</p>
                <select id="leaveType" onChange={handleSelectChange}>
                    <option value="-1">Choose</option>
                    {leaveTypes.map((leaveType, index) => (
                        <option key={index} value={index}>{leaveType.leaveTypeLabel}</option>
                    ))}
                </select>
            </div>

            <div>
                <p>(Superior)</p>
                <select id="superior" onChange={handleSelectChange}>
                    <option value="-1">Choose</option>
                    {superiors.map((superior, index) => (
                        <option key={index} value={index}>{superior.firstName + " " + superior.middleName + " " + superior.lastName}</option>
                    ))}
                </select>
            </div>

            <div>
                <p>(Status)</p>
                <select id="status" onChange={handleSelectChange}>
                    <option value="-1">Choose</option>
                    {leaveStatuses.map((leaveStatus, index) => (
                        <option key={index} value={index}>{leaveStatus.leaveStatusLabel}</option>
                    ))}
                </select>
            </div>
            </div>
            <div onClick={handleRequestLeave}>
                    <DefaultButton label="Request Leave"></DefaultButton>
                </div>
                <div onClick={handleCancel}>
                    <DefaultButton label="Cancel"></DefaultButton>
                </div>
        </div>
        
    );
}

AddLeave.propTypes = {
    setLeaves: PropTypes.func.isRequired,
    employee: PropTypes.number.isRequired,
    onEmployeeChange: PropTypes.func.isRequired,
    type: PropTypes.number.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    superior: PropTypes.number.isRequired,
    onSuperiorChange: PropTypes.func.isRequired,
    status: PropTypes.number.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    setRequestLeaveVisibility: PropTypes.func.isRequired,
    employees: PropTypes.array.isRequired,
    superiors: PropTypes.array.isRequired,
    leaveStatuses: PropTypes.array.isRequired,
    leaveTypes: PropTypes.array.isRequired,
};

export default AddLeave;