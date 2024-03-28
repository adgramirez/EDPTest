//view add superior

import { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeTable from './components/EmployeeTable';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import DeleteEmployee from './components/DeleteEmployee';
import SuperiorTable from './components/Milestone3/SuperiorTable';
import AddSuperior from './components/Milestone3/AddSuperior';
import EditSuperior from './components/Milestone3/EditSuperior';
import DeleteSuperior from './components/Milestone3/DeleteSuperior';

function App() {
  const [employees, setEmployees] = useState([
    {
      employeeNumber: "123",
          firstName: "j",
          middleName: "k",
          lastName: "l",
          contactInformation: "0922",
          HouseNumber: "b10",
          Street: "aguila",
          Barangay: "mandug",
          City: "dv",
          Province: "dds",
          Country: "ph",
          ZIPcode: "800",
          employeeType: "reg",
          designationName: "manager",
          departmentName: "it"
    }
  ]);
  const [addEmployeeVisibility, setAddEmployeeVisibility] = useState(false);
  const [editEmployeeVisibility, setEditEmployeeVisibility] = useState({
    visibility: false,
    index: -1
  });
  const [deleteEmployeeVisibility, setDeleteEmployeeVisibility] = useState(null);

  const [superiors, setSuperiors] = useState([{
    superiorNumber: "123",
        firstName: "j",
        middleName: "k",
        lastName: "l",
        contactInformation: "0922",
        HouseNumber: "b10",
        Street: "aguila",
        Barangay: "mandug",
        City: "dv",
        Province: "dds",
        Country: "ph",
        ZIPcode: "800",
        employeeType: "reg",
        designationName: "manager",
        departmentName: "it"
  }]);
  const [addSuperiorVisibility, setAddSuperiorVisibility] = useState(false);
  const [editSuperiorVisibility, setEditSuperiorVisibility] = useState({
    visibility: false,
    index: -1
  });
  const [deleteSuperiorVisibility, setDeleteSuperiorVisibility] = useState(null);

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
        {deleteEmployeeVisibility && (
          <DeleteEmployee
            employeeNumber={deleteEmployeeVisibility}
            setDeleteEmployeeVisibility={setDeleteEmployeeVisibility}
            setEmployees={setEmployees}
          />
        )}
      </div>

      <div className='table-button-container'>
        <SuperiorTable
          superiors={superiors}
          setSuperiors={setSuperiors}
          addSuperiorVisibility={addSuperiorVisibility}
          setAddSuperiorVisibility={setAddSuperiorVisibility}
          editSuperiorVisibility={editSuperiorVisibility}
          setEditSuperiorVisibility={setEditSuperiorVisibility}
          setDeleteSuperiorVisibility={setDeleteSuperiorVisibility} 
        />
      </div>
      <div className='default-container'>
        {addSuperiorVisibility && (<AddSuperior 
          setAddSuperiorVisibility={setAddSuperiorVisibility}
          setSuperiors={setSuperiors}
        />)}
      {editSuperiorVisibility.visibility && (
          <EditSuperior
            editSuperiorVisibility={editSuperiorVisibility}
            setEditSuperiorVisibility={setEditSuperiorVisibility}
            setSuperiors={setSuperiors}
            superiors={superiors}
          />
        )}
      {deleteSuperiorVisibility && (
          <DeleteSuperior
            superiorNumber={deleteSuperiorVisibility}
            setDeleteSuperiorVisibility={setDeleteSuperiorVisibility}
            setSuperiors={setSuperiors}
          />
        )}
      </div>
    </div>
  );
}

export default App;