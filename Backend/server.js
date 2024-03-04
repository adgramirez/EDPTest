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
    return res.json("From Backend Side");
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

    // Insert the employee data into the database
    const sql = "INSERT INTO employees SET ?";
    db.query(sql, employeeData, (err, result) => {
        if (err) {
            console.error("Error adding employee:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json({ message: "Employee added successfully" });
    });
});

app.listen(8081, () => {
    console.log("listening");
});
