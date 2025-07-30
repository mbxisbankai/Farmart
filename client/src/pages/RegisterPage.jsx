// src/pages/RegisterPage.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3).required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  role: Yup.string().required("Role is required"),
});

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting, setErrors, setStatus }) => {
    console.log("=== REGISTRATION ATTEMPT STARTED ===");
    console.log("Form values:", values);
    
    try {
      console.log("Making API request to:", `https://farmart-server-dcd6.onrender.com/api/auth/register`);
      
      // Create axios instance with detailed config
      const response = await axios({
        method: 'POST',
        url: `${backendUrl}/api/auth/register`,
        data: values,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // 10 second timeout
        withCredentials: false, // Explicitly set to false to match backend
      });
      
      console.log("✅ Registration successful!");
      console.log("Response:", response.data);
      
      setStatus({ type: 'success', message: 'Registration successful! Redirecting to login...' });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Registration error:", error);
      
      if (error.code === 'ECONNABORTED') {
        console.error("Request timeout - server might be down");
        setStatus({ type: 'error', message: "Request timeout. Please check if the server is running." });
      } else if (error.response) {
        // Server responded with error status
        console.error("Server error response:");
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
        
        const errorData = error.response.data;
        
        if (errorData && errorData.error) {
          if (errorData.error.includes("Email already registered")) {
            setErrors({ email: errorData.error });
          } else if (errorData.error.includes("Username already taken")) {
            setErrors({ username: errorData.error });
          } else if (errorData.error.includes("Password")) {
            setErrors({ password: errorData.error });
          } else {
            setStatus({ type: 'error', message: errorData.error });
          }
        } else {
          setStatus({ type: 'error', message: "Registration failed. Please try again." });
        }
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received from server:");
        console.error("Request config:", error.config);
        console.error("Request details:", error.request);
        setStatus({ 
          type: 'error', 
          message: "No response from server. Please check if the server is running." 
        });
      } else {
        // Something else happened
        console.error("Unexpected error:", error.message);
        setStatus({ type: 'error', message: "An unexpected error occurred: " + error.message });
      }
    } finally {
      console.log("=== REGISTRATION ATTEMPT FINISHED ===");
      setSubmitting(false);
    }
  };

  // Test server connectivity on component mount
  React.useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing server connection...");
        const response = await axios.get(`${backendUrl}/api/auth/check_session`);
        console.log("Server reachable (expected 401):", response.status);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("✅ Server is reachable (401 expected for unauthenticated check_session)");
        } else {
          console.error("❌ Server connection test failed:", error.message);
        }
      }
    };
    
    testConnection();
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 w-100" style={{ maxWidth: "600px" }}>
        <h3 className="text-center mb-4">Register</h3>
        
        <Formik
          initialValues={{ username: "", email: "", password: "", role: "farmer" }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {/* Status messages */}
              {status && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mb-3`}>
                  {status.message}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Username</label>
                <Field name="username" className="form-control" placeholder="Enter your username" />
                <ErrorMessage name="username" component="div" className="text-danger small mt-1" />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <Field name="email" type="email" className="form-control" placeholder="Enter your email" />
                <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <Field name="password" type="password" className="form-control" placeholder="Enter your password" />
                <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <Field as="select" name="role" className="form-select">
                  <option value="farmer">Farmer</option>
                  <option value="buyer">Buyer</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-danger small mt-1" />
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </Form>
          )}
        </Formik>
        
        <p className="text-center mt-3 mb-0">
          Already have an account? <a href="/login" className="text-decoration-none">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;