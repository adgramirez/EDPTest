const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root",
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

// Endpoint for departments
app.get('/department', (req, res) => {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        return res.json(data);
    });
});

// Endpoint for designations
app.get('/designation', (req, res) => {
    const sql = "SELECT * FROM designation";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        return res.json(data);
    });
});

// Endpoint for addresses
app.get('/address', (req, res) => {
    const sql = "SELECT * FROM address";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
        return res.json(data);
    });
});

// Endpoint for assignment_designation
app.get('/assignment_designation', (req, res) => {
    const sql = "SELECT * FROM assignment_designation";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: "Internal Server Error" });
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

  app.delete('/deleteEmployee/:employee_ID', (req, res) => {
    const { employee_ID } = req.params; // Corrected parameter name

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


  
  // Ensure this is placed outside the /addEmployee endpoint
  

app.listen(8081, () => {
  console.log("listening");
});
