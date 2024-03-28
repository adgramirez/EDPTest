//partially edited

import PropTypes from 'prop-types';
import InputDate from '../../UI/InputDate';

function AddLeave({ onTypeChange, onDesignationChange, onDepartmentChange }) {
    const handleSelectChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'employeeType':
                onTypeChange(value);
                break;
            case 'designationName':
                onDesignationChange(value);
                break;
            case 'departmentName':
                onDepartmentChange(value);
                break;
            default:
                break;
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        onAddressChange(prevAddress => ({
            ...prevAddress,
            [field]: value
        }));
    };

    return (
        <div className="flex left-align">
            <div>
                <p>(Employee Name)</p>
                <select id="employeeName" onChange={handleSelectChange}>
                    <option value="0">Choose</option>
                </select>
            </div>
            <div>
                <p>(House No.)</p>
                <InputDate label="Ex. B10, L5" onChange={(e) => handleInputChange(e, 'HouseNumber')}/>
            </div>
        </div>
    );
}

AddLeave.propTypes = {
    onTypeChange: PropTypes.func.isRequired,
    onDesignationChange: PropTypes.func.isRequired,
    onDepartmentChange: PropTypes.func.isRequired
};

export default AddLeave;