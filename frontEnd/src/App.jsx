/* eslint-disable no-unused-vars */
import { useEffect, useState} from 'react'
import EmployeeTable from './components/EmployeeTable.jsx';
import AddEmployee from './components/AddEmployee.jsx';

function App() {
  //source should be database
  const [employees, setEmployees] = useState([{
    employeeNo: '320',
    name: 'jkrl',
    contact: '0922',
    address: 'mandug',
    designation: 'mngr',
    employeeType: 'regular',
    status: 'active',
    department: 'hr',
  }, {
    employeeNo: '320',
    name: 'adgr',
    contact: '0928',
    address: 'quirino',
    designation: 'asst mngr',
    employeeType: 'part-time',
    status: 'active',
    department: 'it',
  }]);

  const [data, setData] = useState([])
  useEffect(()=>{
    fetch('http://localhost:8081/department')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])

  const [addEmployeeVisibility, setAddEmployeeVisibility] = useState(false);

  return(
    <>
      <div style = {{padding: "100px"}}>
        <table>
          <thead>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key ={i}>
                <td>{d.department_ID}</td>
                <td>{d.departmentName}</td>
                <td>{d.status}</td>
              </tr>
            ) )}
          </tbody>
        </table>
      </div>
      <div className='default-container'>
        <div className='table-button-container'>
          <EmployeeTable employees={employees} setEmployees={setEmployees} addEmployeeVisibility={addEmployeeVisibility} setAddEmployeeVisibility={setAddEmployeeVisibility}/>
        </div>
        <div className='default-container'>
          {addEmployeeVisibility && <AddEmployee setAddEmployeeVisibility={setAddEmployeeVisibility}></AddEmployee>}
        </div>
      </div>
      
      
    </>
    
  )
}

export default App