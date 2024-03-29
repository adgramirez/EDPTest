import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeTable from './components/EmployeeTable';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import DeleteEmployee from './components/DeleteEmployee';

function App() {
  const [employees, setEmployees] = useState([]);
  const [addEmployeeVisibility, setAddEmployeeVisibility] = useState(false);
  const [editEmployeeVisibility, setEditEmployeeVisibility] = useState({
    visibility: false,
    index: -1
  });
  const [deleteEmployeeVisibility, setDeleteEmployeeVisibility] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesResponse = await axios.get('http://localhost:8081/employee');
        setEmployees(employeesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='default-container'>
      <div className='table-button-container'>
        <EmployeeTable
          employees={employees}
          setEmployees={setEmployees}
          addEmployeeVisibility={addEmployeeVisibility}
          setAddEmployeeVisibility={setAddEmployeeVisibility}
          editEmployeeVisibility={editEmployeeVisibility}
          setEditEmployeeVisibility={setEditEmployeeVisibility}
          setDeleteEmployeeVisibility={setDeleteEmployeeVisibility} 
        />
      </div>
      <div className='default-container'>
        {addEmployeeVisibility && (
          <AddEmployee
            setAddEmployeeVisibility={setAddEmployeeVisibility}
            setEmployees={setEmployees}
          />
        )}
        {editEmployeeVisibility.visibility && (
          <EditEmployee
            editEmployeeVisibility={editEmployeeVisibility}
            setEditEmployeeVisibility={setEditEmployeeVisibility}
            setEmployees={setEmployees}
            employees={employees}
          />
        )}
        {}
        {deleteEmployeeVisibility && (
          <DeleteEmployee
            employeeNumber={deleteEmployeeVisibility}
            setDeleteEmployeeVisibility={setDeleteEmployeeVisibility}
            setEmployees={setEmployees}
          />
        )}
      </div>
    </div>
  );
}

export default App;