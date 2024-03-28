const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fifteen15",
  database: "edp"
});

app.get('/', (req, res) => {
  const sql = `
    SELECT employee.*, address.*, designation.*, assignment_designation.employeeType, department.*
    FROM assignment_designation
    JOIN employee ON assignment_designation.employee_id = employee.employee_id
    JOIN address ON employee.address_id = address.address_id
    JOIN designation ON assignment_designation.designation_id = designation.designation_id
    JOIN department ON designation.department_id = department.department_id
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    console.log(data);
    return res.json(data);
  });
});

app.get('/employee', (req, res) => {
    const sql = `
        SELECT employee.*, address.*, designation.*, assignment_designation.employeeType, department.*
        FROM assignment_designation
        JOIN employee ON assignment_designation.employee_id = employee.employee_id
        JOIN address ON employee.address_id = address.address_id
        JOIN designation ON assignment_designation.designation_id = designation.designation_id
        JOIN department ON designation.department_id = department.department_id
    `;
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        console.log(data);
        return res.json(data);
    });
});

app.post('/addEmployee', (req, res) => {
  const employeeData = req.body;
  console.log("Received employee data:", employeeData);

  // Add Address
  const address = {
    HouseNumber: employeeData.HouseNumber,
    Street: employeeData.Street,
    Barangay: employeeData.Barangay,
    City: employeeData.City,
    Province: employeeData.Province,
    Country: employeeData.Country,
    ZIPcode: employeeData.ZIPcode
  };
  console.log("Processed address data:", address);
  db.query("INSERT INTO address SET ?", address, (err, addressResult) => {
    if (err) {
      console.error("Error adding address:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const address_ID = addressResult.insertId;

    // Add Department
    const department = {
      departmentName: employeeData.departmentName
    }
    console.log("Processed department data:", department);
    db.query(
      "INSERT INTO department SET ?", department, (err, departmentResult) => {
        if (err) {
          console.error("Error adding department:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        const department_id = departmentResult.insertId;

        // Add Designation
        const designation = {
          designationName: employeeData.designationName,
          department_ID: department_id,
        };
    console.log("Processed designation data:", designation);
      db.query("INSERT INTO designation SET ?", designation, (err, designationResult) => {
        if (err) {
          console.error("Error adding designation:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        const designation_ID = designationResult.insertId;
      
        // Add Employee 
        const employee = {
          employeeNumber: employeeData.employeeNumber,
          firstName: employeeData.firstName,
          middleName: employeeData.middleName,
          lastName: employeeData.lastName,
          contactInformation: employeeData.contactInformation,
          address_ID: address_ID,
        };
        console.log("Processed employee data:", employee);
        db.query("INSERT INTO employee SET ?", employee, (err, employeeResult) => {
          if (err) {
            console.error("Error adding employee:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }
          const employee_ID = employeeResult.insertId;

          // Add Assignment_Designation
          const assignment_designation = {
            employee_ID: employee_ID,
            designation_ID: designation_ID,
            employeeType: employeeData.employeeType
          };
          console.log("Processed assignment_designation data:",  assignment_designation);
          db.query("INSERT INTO assignment_designation SET ?", assignment_designation, (err) => {
            if (err) {
              console.error("Error adding assignment_designation:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
            return res.status(201).json({ message: "Employee added successfully" });
          });
        });
      });
    });
  });
});

app.delete('/deleteEmployee/:employee_ID', (req, res) => {
  const { employee_ID } = req.params;

  const sql = `DELETE FROM edp.employee WHERE employee_ID = ?;`;
  db.query(sql, [employee_ID], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Employee deleted successfully");
     return res.status(200).json({ message: "Employee deleted successfully" });
  });
});

app.put('/editEmployee/:employee_ID', (req, res) => {
  const employeeId = req.params.employee_ID;
  const employeeData = req.body;

  db.query(`
      SELECT a.address_ID, employeeType, d.designationName, dept.departmentName
      FROM assignment_designation ad
      JOIN employee e ON ad.employee_ID = e.employee_ID
      JOIN address a ON e.address_ID = a.address_ID
      JOIN designation d ON ad.designation_ID = d.designation_ID
      JOIN department dept ON d.department_ID = dept.department_ID
      WHERE ad.employee_ID = ?;
  `, [employeeId], (err, results) => {

    if (err) {
      console.error("Error fetching current employee details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      console.error("No current employee details found for employee ID:", employeeId);
      return res.status(404).json({ error: "Employee not found" });
    }
    const currentEmployeeDetails = results[0];
    console.log("Current Employee Details:", currentEmployeeDetails);

    const currentDesignationName = currentEmployeeDetails.designationName;
    const currentDepartmentName = currentEmployeeDetails.departmentName;
    const currentEmployeeType = currentEmployeeDetails.employeeType;

    const isDesignationChanged = employeeData.designationName !== currentDesignationName;
    const isDepartmentChanged = employeeData.departmentName !== currentDepartmentName;
    const isEmployeeTypeChanged = employeeData.employeeType !== currentEmployeeType;

    console.log("isDesignationChanged: ", isDesignationChanged);
    console.log("isDepartmentChanged: ", isDepartmentChanged);
    console.log("isEmployeeTypeChanged: ", isEmployeeTypeChanged);

    // Edit Employee
    const updateEmployeeSql = `
      UPDATE employee
      SET employeeNumber = ?,
         firstName = ?,
         middleName = ?,
         lastName = ?,
         contactInformation = ?,
         address_ID = ?
      WHERE employee_ID = ?
    `;

    db.query(updateEmployeeSql, [
      employeeData.employeeNumber,
      employeeData.firstName,
      employeeData.middleName,
      employeeData.lastName,
      employeeData.contactInformation,
      currentEmployeeDetails.address_ID,
      employeeId
    ], (err) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Update Address
      const updateAddressSql = `
        UPDATE address
        SET HouseNumber = ?,
            Street = ?,
            Barangay = ?,
            City = ?,
            Province = ?,
            Country = ?,
            ZIPcode = ?
        WHERE address_ID = ?
      `;

      db.query(updateAddressSql, [
        employeeData.HouseNumber,
        employeeData.Street,
        employeeData.Barangay,
        employeeData.City,
        employeeData.Province,
        employeeData.Country,
        employeeData.ZIPcode,
        currentEmployeeDetails.address_ID
      ], (err) => {
        if (err) {
          console.error("Error updating address:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Address updated successfully:", employeeData);

        // Update Designation and Department
        if (isDesignationChanged) {
          db.query(`
            SELECT designation_ID
            FROM assignment_designation
            WHERE employee_ID = ?;
          `, [employeeId], (err, results) => {
              if (err) {
                  console.error("Error fetching designation ID:", err);
                  return res.status(500).json({ error: "Internal Server Error" });
              }
              if (results.length === 0) {
                  console.error("No designation found for employee ID:", employeeId);
                  return res.status(404).json({ error: "Designation not found" });
              }      
              const designationId = results[0].designation_ID;
      
              // Update Designation
              const updateDesignationSql = `
                UPDATE designation
                SET designationName = ?
                WHERE designation_ID = ?
              `;

              db.query(updateDesignationSql, [
                  employeeData.designationName,
                  designationId
              ], (err) => {
                  if (err) {
                      console.error("Error updating designation:", err);
                      return res.status(500).json({ error: "Internal Server Error" });
                  }
                  console.log("Designation updated successfully:", employeeData.designationName);
              });
          });
        }

        // Update Department
        if (isDepartmentChanged) {
          db.query(`
            SELECT department_ID
            FROM designation
            WHERE designation_ID = (
                SELECT designation_ID
                FROM assignment_designation
                WHERE employee_ID = ?
            );
          `, [employeeId], (err, results) => {
              if (err) {
                  console.error("Error fetching department ID:", err);
                  return res.status(500).json({ error: "Internal Server Error" });
              }
              if (results.length === 0) {
                  console.error("No department found for employee ID:", employeeId);
                  return res.status(404).json({ error: "Department not found" });
              }
              const departmentId = results[0].department_ID;
      
              const updateDepartmentSql = `
                UPDATE department
                SET departmentName = ?
                WHERE department_ID = ?
              `;
      
              db.query(updateDepartmentSql, [
                  employeeData.departmentName,
                  departmentId
              ], (err) => {
                  if (err) {
                      console.error("Error updating department:", err);
                      return res.status(500).json({ error: "Internal Server Error" });
                  }
                  console.log("Department updated successfully:", employeeData.departmentName);
              });
          });
      }

      // Update EmployeeType
        if (isEmployeeTypeChanged) {
          const updateAssignment_DesignationSql =`
            UPDATE assignment_designation
            SET employeeType = ?
            WHERE employee_ID = ?
          `;
  
          db.query(updateAssignment_DesignationSql, [
            employeeData.employeeType,
            employeeId
          ], (err) => {
            if (err) {
              console.error("Error updating employee type:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            }
          });
        }
        console.log("Employee updated successfully:", employeeData);
        res.status(200).json({ message: "Employee updated successfully" });
      });
    });
  });
});
  
app.listen(8081, () => {
  console.log("listening");
});