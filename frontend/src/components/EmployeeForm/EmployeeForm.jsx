import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker CSS

// Departments array for the dropdown
const departments = ["HR", "Engineering", "Marketing"];

// Zod schema for validation
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

const EmployeeForm = () => {
  const [date, setDate] = useState(null); // State to store the selected date

  const {
    register,
    handleSubmit,
    reset,
    setValue, // To set the value of date in react-hook-form
    formState: { errors },
  } = useForm({ resolver: zodResolver(employeeSchema) });

  const onSubmit = async (formData) => {
    try {
      // Your API call (e.g., axios or fetch)
      const response = await axios.post('/api/employees', formData);
      console.log('Response:', response);
    } catch (error) {
      // Log the full error to inspect the structure
      console.error('Error during API call:', error);
  
      // Check if error.response and error.response.data exist
      if (error.response && error.response.data) {
        const errors = error.response.data.errors;
        if (errors) {
          console.log('Errors:', errors);
          // Handle your errors here (e.g., update form state)
        } else {
          console.log('No specific errors returned from the server.');
        }
      } else {
        console.error('Error response or error data is not available.');
        // Handle case when error.response or error.response.data is undefined
      }
    }
  };
  

  // Sync the selected date with React Hook Form's value
  const handleDateChange = (date) => {
    setDate(date);
    setValue("dateOfJoining", date.toISOString().split("T")[0]); // Update form value
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="mb-4">
        <input
          {...register("employeeId")}
          placeholder="Employee ID"
          className={`border p-2 w-full rounded ${errors.employeeId ? 'border-red-500' : ''}`}
        />
        {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("name")}
          placeholder="Name"
          className={`border p-2 w-full rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("email")}
          placeholder="Email"
          className={`border p-2 w-full rounded ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("phone")}
          placeholder="Phone"
          className={`border p-2 w-full rounded ${errors.phone ? 'border-red-500' : ''}`}
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
      </div>

      <div className="mb-4">
        <select
          {...register("department")}
          className={`border p-2 w-full rounded ${errors.department ? 'border-red-500' : ''}`}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && <p className="text-red-500 text-sm">{errors.department.message}</p>}
      </div>

      {/* DatePicker component for Date of Joining */}
      <div className="mb-4">
        <DatePicker
          selected={date}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()} // Disable future dates
          placeholderText="Select Date"
          className={`border p-2 w-full rounded ${errors.dateOfJoining ? 'border-red-500' : ''}`}
        />
        {errors.dateOfJoining && <p className="text-red-500 text-sm">{errors.dateOfJoining.message}</p>}
      </div>

      <div className="mb-4">
        <input
          {...register("role")}
          placeholder="Role"
          className={`border p-2 w-full rounded ${errors.role ? 'border-red-500' : ''}`}
        />
        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
      </div>

      <div className="mb-4 flex gap-4">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit</button>
        <button
          type="button"
          onClick={() => {
            reset();
            setDate(null); // Reset date picker
          }}
          className="bg-gray-500 text-white p-2 rounded w-full"
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
