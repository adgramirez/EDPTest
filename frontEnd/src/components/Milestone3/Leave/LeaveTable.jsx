//partially edited

import PropTypes from 'prop-types';
import axios from 'axios';
import DefaultButton from '../../UI/DefaultButton';

function LeaveTable({ setRequestLeaveVisibility, setEditLeaveVisibility, setLeaves, leaves, addLeaveVisibility }) {
    // const handleAdd = () => {
    //     setRequestLeaveVisibility(true);
    // };
    // const handleDelete = async (leave_ID) => {
    //     if (window.confirm('Are you sure you want to delete this leave?')) {
    //         try {
    //             const response = await axios.delete(`http://localhost:8081/deleteLeave/${leave_ID}`);
    //             if (response.status === 200) {
    //                 console.log("Leave deleted successfully");
    //                 setLeaves(prevLeaves => prevLeaves.filter(lv => lv.leave_ID !== leave_ID));
    //             } else {
    //                 console.error("Error deleting leave:", response.data);
    //             }
    //         } catch (error) {
    //             console.error("Error deleting leave:", error);
    //         }
    //     }
    // };
    
    return (
        <div>
            <table className="border-black border border-solid border-collapse">
                <thead>
                    <tr>
                        <th className="border-black border border-solid border-collapse">Employee No.</th>
                        <th className="border-black border border-solid border-collapse">Name</th>
                        <th className="border-black border border-solid border-collapse">Designation</th>
                        <th className="border-black border border-solid border-collapse">Employee Type</th>
                        <th className="border-black border border-solid border-collapse">Department</th>
                        <th className="border-black border border-solid border-collapse">Superior</th>
                        <th className="border-black border border-solid border-collapse">Status</th>
                        <th className="border-black border border-solid border-collapse">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.length > 0 ? (
                        leaves.map((leave, index) => (
                            <tr key={index}>
                                <td>{leave.employee.employeeNumber}</td>
                                <td>{leave.employee.firstName + " " + leave.employee.middleName + " " + leave.employee.lastName}</td>
                                <td>{leave.employee.designationName}</td>
                                <td>{leave.employee.employeeType}</td>
                                <td>{leave.employee.departmentName}</td>
                                <td>{leave.superior.firstName + " " + leave.superior.middleName + " " + leave.superior.lastName}</td>
                                <td>{leave.leave.status}</td>
                                {/* <td>
                                    <div className='edit-delete-buttons'>
                                        <button className='edit-button' onClick={() => setEditLeaveVisibility({ visibility: true, index: index })}>Edit Details</button>
                                        <button className='delete-button' onClick={() => handleDelete(leave.leave_ID)}>Remove Leave</button>
                                    </div>
                                </td> */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td id="empty-list-label" colSpan={9} className="border-black border border-solid border-collapse">No leaves found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* <div className='add-button-container' onClick={handleAdd}>
                {!addLeaveVisibility && <DefaultButton label="Request Leave"></DefaultButton>}
            </div> */}
        </div>
    );
}

LeaveTable.propTypes = {
    leaves: PropTypes.arrayOf(
        //leave array contains leave objects
        //leave objects contain employee and superior objects

        PropTypes.shape({
            //employee object
            employee: PropTypes.shape({
                employee_ID: PropTypes.number.isRequired,
                employeeNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                name: PropTypes.string.isRequired,
                contact: PropTypes.string.isRequired,
                HouseNumber: PropTypes.string.isRequired,
                Street: PropTypes.string.isRequired,
                Barangay: PropTypes.string.isRequired,
                City: PropTypes.string.isRequired,
                Province: PropTypes.string.isRequired,
                Country: PropTypes.string.isRequired,
                ZIPcode: PropTypes.string.isRequired,
                designation: PropTypes.string.isRequired,
                employeeType: PropTypes.string.isRequired,
                department: PropTypes.string.isRequired,
            }).isRequired,

            //superior object
            superior: PropTypes.shape({
                superior_ID: PropTypes.number.isRequired,
                superiorNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                name: PropTypes.string.isRequired,
                contact: PropTypes.string.isRequired,
                HouseNumber: PropTypes.string.isRequired,
                Street: PropTypes.string.isRequired,
                Barangay: PropTypes.string.isRequired,
                City: PropTypes.string.isRequired,
                Province: PropTypes.string.isRequired,
                Country: PropTypes.string.isRequired,
                ZIPcode: PropTypes.string.isRequired,
                designation: PropTypes.string.isRequired,
                employeeType: PropTypes.string.isRequired,
                department: PropTypes.string.isRequired,
            }).isRequired,

            //other details
            leave: PropTypes.shape({
                startDate: PropTypes.string.isRequired,
                endDate: PropTypes.string.isRequired,
                leaveType: PropTypes.string.isRequired,
                status: PropTypes.string.isRequired,
            })
        })
    ).isRequired,
    setRequestLeaveVisibility: PropTypes.func.isRequired, 
    setEditLeaveVisibility: PropTypes.func.isRequired, 
    setLeaves: PropTypes.func.isRequired, 
    addLeaveVisibility: PropTypes.bool.isRequired

    
};

export default LeaveTable;
