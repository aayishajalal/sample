const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const { z } = require("zod");
require("dotenv").config();

const prisma = new PrismaClient();
const app = express();

// CORS middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // Allow the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies and other credentials
}));

app.use(express.json()); // For parsing JSON bodies

// Zod validation schema for employee
const employeeSchema = z.object({
  employeeId: z.string().max(10, "Max 10 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\d{10}$/, "Must be 10 digits"),
  department: z.string().min(1, "Department is required"),
  dateOfJoining: z.string().refine(
    (date) => new Date(date) <= new Date(),
    "Cannot be a future date"
  ),
  role: z.string().min(1, "Role is required"),
});

// API endpoint to add an employee
app.post("/api/employees", async (req, res) => {
  try {
    const validatedData = employeeSchema.parse(req.body);
    
    // Parse the dateOfJoining into a Date object
    const dateOfJoining = new Date(validatedData.dateOfJoining);

    // Create the new employee record in the database
    const newEmployee = await prisma.employee.create({
      data: {
        ...validatedData,
        dateOfJoining: dateOfJoining, // Use Date object for Prisma
      },
    });

    res.status(201).json({ message: "Employee added successfully", newEmployee });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
