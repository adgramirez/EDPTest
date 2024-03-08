const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "AdDU2202201425196",
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
    console.log(data); // Log the entire response data
    return res.json(data);
  });
});

// Endpoint for employees
// Update the /employee endpoint
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
        console.log(data); // Log the entire response data
        return res.json(data);
    });
});

app.post('/addEmployee', (req, res) => {
  const employeeData = req.body;
  console.log("Received employee data:", employeeData);

  // 1. Prepare address data
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

  // 2. Insert address first and get the generated address_id
  db.query("INSERT INTO address SET ?", address, (err, addressResult) => {
    if (err) {
      console.error("Error adding address:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const address_ID = addressResult.insertId;

    // 3. Insert department (always attempt to create a new one)
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

        // 4. Prepare designation data (including department_id)
        const designation = {
          designationName: employeeData.designationName,
          department_ID: department_id, // Always use the newly created ID
        };

    console.log("Processed designation data:", designation);

    // 5. Insert designation data and get generated designation_id
    db.query("INSERT INTO designation SET ?", designation, (err, designationResult) => {
      if (err) {
        console.error("Error adding designation:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const designation_ID = designationResult.insertId;
    
      // 6. Prepare employee data
      const employee = {
        employeeNumber: employeeData.employeeNumber,
        firstName: employeeData.firstName,
        middleName: employeeData.middleName,
        lastName: employeeData.lastName,
        contactInformation: employeeData.contactInformation,
        address_ID: address_ID,
        // Removed designation_id as it's not present in the employee table
      };

      console.log("Processed employee data:", employee);

      // 7. Insert employee data
      db.query("INSERT INTO employee SET ?", employee, (err, employeeResult) => {
        if (err) {
          console.error("Error adding employee:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const employee_ID = employeeResult.insertId;

        

        // 8. Insert assignment_designation data (regardless of department selection)
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

app.put('/editEmployee/:id', (req, res) => {
  const employeeId = req.params.id;
  const employeeData = req.body;

  // Fetch current designation and department names from the database
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
    console.log("Current address_ID: ", currentEmployeeDetails.address_ID);

    console.log("Current Employee Details:", currentEmployeeDetails);

    // Extract designationName, departmentName, and employeeType from the fetched data
    const currentDesignationName = currentEmployeeDetails.designationName;
    const currentDepartmentName = currentEmployeeDetails.departmentName;
    const currentEmployeeType = currentEmployeeDetails.employeeType;

    // Compare with the new values from employeeData
    const isDesignationChanged = employeeData.designationName !== currentDesignationName;
    const isDepartmentChanged = employeeData.departmentName !== currentDepartmentName;
    const isEmployeeTypeChanged = employeeData.employeeType !== currentEmployeeType;

    console.log("isDesignationChanged: ", isDesignationChanged);
    console.log("isDepartmentChanged: ", isDepartmentChanged);
    console.log("isEmployeeTypeChanged: ", isEmployeeTypeChanged);

    // Update employee table
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

      // Update address table
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
        
        // Now you can proceed with updating other tables (designation, department, etc.) if needed

        // Update designation and department tables if necessary
        if (isDesignationChanged) {
          // Fetch the designation ID based on the employee ID
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
      
              // Update designation table
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

        if (isDepartmentChanged) {
          // Fetch the department ID based on the designation ID
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
      
              // Update department table
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