import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// Add token to every request
API.interceptors.request.use((config) => {  // Intercept request to add token
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`;  // Add token to headers if it exists 
  return config;    // Return modified config
});

// Auth 
export const registerCandidate = (data) => API.post('/auth/register/candidate', data);
export const registerCompany = (data) => API.post('/auth/register/company', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Jobs 
export const getJobs = (params) => API.get('/jobs', { params });
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const postJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getMyJobs = () => API.get('/jobs/company/myjobs');

// Applications
export const applyForJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my-applications');
export const getJobApplicants = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateAppStatus = (id, status) => API.put(`/applications/${id}/status`, { status });

// Saved Jobs
export const saveJob = (jobId) => API.post('/saved-jobs', { jobId });
export const getSavedJobs = () => API.get('/saved-jobs');
export const unsaveJob = (jobId) => API.delete(`/saved-jobs/${jobId}`);

// Resume
export const uploadResume = (formData) => API.post('/resume/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAllCandidates = () => API.get('/admin/candidates');
export const getAllCompanies = () => API.get('/admin/companies');
export const getAllJobs = () => API.get('/admin/jobs');
export const getAllApplications = () => API.get('/admin/applications');
export const adminDeleteCandidate = (id) => API.delete(`/admin/candidates/${id}`);
export const adminDeleteCompany = (id) => API.delete(`/admin/companies/${id}`);
export const adminDeleteJob = (id) => API.delete(`/admin/jobs/${id}`);

// Academy & Courses
export const getCourses = () => API.get('/courses');
export const getCourseById = (id) => API.get(`/courses/${id}`);
export const enrollInCourse = (id) => API.post(`/courses/${id}/enroll`);

// Mentorship
export const getMentors = () => API.get('/mentorship/mentors');
export const bookMentorship = (data) => API.post('/mentorship/book', data);
export const getMyBookings = () => API.get('/mentorship/my-bookings');
export const updateBookingStatus = (id, data) => API.put(`/mentorship/${id}/status`, data);

// Payment
export const createPaymentOrder = () => API.post('/payment/create-order');
export const verifyPayment = (data) => API.post('/payment/verify', data);
export default API;
