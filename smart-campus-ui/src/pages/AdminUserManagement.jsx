import React, { useState, useEffect } from "react";
import { createUser, getAllUsers, getUserStats, updateUserStatus, deleteUser } from "../services/userService";
import { useToast } from "../context/ToastContext";
import AdminEditUserModal from "../components/AdminEditUserModal";
import AdminViewUserModal from "../components/AdminViewUserModal";
import Swal from 'sweetalert2';

function AdminUserManagement() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("VIEW");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalTechnicians: 0,
    totalActive: 0,
    totalInactive: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    role: "STUDENT",
    isActive: true,
    studentId: "",
    batchYear: "",
    faculty: "",
    employeeId: "",
    department: "",
    specialization: "",
    designation: "",
    officeLocation: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (activeTab === "VIEW") {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err) {
      showToast("Failed to load users and stats", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData };
    Object.keys(payload).forEach(key => {
        if (payload[key] === "") payload[key] = null;
    });
    
    try {
      await createUser(payload);
      showToast("User created successfully!", "success");
      setFormData(initialFormState);
    } catch (err) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setActionLoading(id);
    try {
      await updateUserStatus(id, !currentStatus);
      showToast(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`, "success");
      await fetchData();
    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete"
    });

    if (!result.isConfirmed) return;

    setActionLoading(id);
    try {
      await deleteUser(id);
      Swal.fire("Deleted!", "User has been deleted successfully.", "success");
      await fetchData();
    } catch (err) {
      Swal.fire("Error!", "Failed to delete user. Please try again.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const filteredUsers = roleFilter === "ALL" 
    ? users 
    : users.filter(u => u.role === roleFilter);

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case "ADMIN": return "bg-red-500/20 text-red-500 border border-red-500/30";
      case "STUDENT": return "bg-green-500/20 text-green-500 border border-green-500/30";
      case "LECTURER": return "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30";
      case "TECHNICIAN": return "bg-purple-500/20 text-purple-500 border border-purple-500/30";
      default: return "bg-blue-500/20 text-blue-500 border border-blue-500/30";
    }
  };

  const StatCard = ({ title, value, colorClass }) => (
    <div className="bg-[#0B1220] border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-[#0A6ED3]/10 hover:border-[#0A6ED3]/50 transition-all duration-300 transform hover:-translate-y-1">
      <h4 className="text-gray-400 text-sm font-medium mb-2">{title}</h4>
      <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-[#000919] min-h-screen text-white">
      <h2 className="text-2xl font-semibold mb-8">User Management</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("VIEW")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "VIEW" ? "text-white border-b-2 border-[#0A6ED3]" : "text-gray-400 hover:text-white"
          }`}
        >
          View All Users
        </button>
        <button
          onClick={() => setActiveTab("ADD")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "ADD" ? "text-white border-b-2 border-[#0A6ED3]" : "text-gray-400 hover:text-white"
          }`}
        >
          Add User
        </button>
      </div>

      {/* VIEW USERS TAB */}
      {activeTab === "VIEW" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard title="Total Students" value={stats.totalStudents} colorClass="text-green-400" />
            <StatCard title="Total Lecturers" value={stats.totalLecturers} colorClass="text-yellow-400" />
            <StatCard title="Total Technicians" value={stats.totalTechnicians} colorClass="text-purple-400" />
            <StatCard title="Total Active" value={stats.totalActive} colorClass="text-green-500" />
            <StatCard title="Total Inactive" value={stats.totalInactive} colorClass="text-red-400" />
          </div>

          <div className="bg-[#0B1220] rounded-xl border border-white/10 p-5 shadow-lg">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["ALL", "ADMIN", "STUDENT", "LECTURER", "TECHNICIAN"].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    roleFilter === role 
                      ? "bg-[#0A6ED3] text-white shadow-md shadow-[#0A6ED3]/30" 
                      : "bg-[#000919] text-gray-400 border border-white/10 hover:border-white/30"
                  }`}
                >
                  {role === "ALL" ? "All Users" : role}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#0A6ED3] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                      <th className="p-4 font-medium uppercase tracking-wider">Name</th>
                      <th className="p-4 font-medium uppercase tracking-wider">Email</th>
                      <th className="p-4 font-medium uppercase tracking-wider">Role</th>
                      <th className="p-4 font-medium uppercase tracking-wider">City</th>
                      <th className="p-4 font-medium uppercase tracking-wider">Status</th>
                      <th className="p-4 font-medium uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-4xl mb-2">📭</span>
                            <p>No users found for this role.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-[#1a2332] transition-colors group">
                          <td className="p-4 font-medium">{user.firstName} {user.lastName}</td>
                          <td className="p-4 text-gray-300">{user.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold ${getRoleBadgeColor(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-gray-300">{user.city}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${user.isActive ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
                              {user.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            <button 
                              disabled={actionLoading === user.id}
                              onClick={() => handleViewClick(user)}
                              className={`text-xs px-3 py-1.5 rounded font-medium bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-colors ${actionLoading === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              View Details
                            </button>
                            <button 
                              disabled={actionLoading === user.id}
                              onClick={() => handleToggleStatus(user.id, user.isActive)}
                              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                                user.isActive 
                                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                                  : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                              } ${actionLoading === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button 
                              disabled={actionLoading === user.id}
                              onClick={() => handleEditClick(user)}
                              className={`text-xs px-3 py-1.5 rounded font-medium bg-[#0A6ED3]/20 text-[#0A6ED3] hover:bg-[#0A6ED3]/30 transition-colors ${actionLoading === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              Edit
                            </button>
                            <button 
                              disabled={actionLoading === user.id}
                              onClick={() => handleDelete(user.id)}
                              className={`text-xs px-3 py-1.5 rounded font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors ${actionLoading === user.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD USER TAB */}
      {activeTab === "ADD" && (
        <div className="bg-[#0B1220] rounded-xl border border-white/10 p-6 max-w-4xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Common Fields */}
            <div>
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4 text-[#0A6ED3]">Common User Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Role</label>
                  <select required name="role" value={formData.role} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                    <option value="STUDENT">STUDENT</option>
                    <option value="LECTURER">LECTURER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3 pt-6">
                  <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 text-[#0A6ED3] bg-[#000919] border-white/10 rounded focus:ring-[#0A6ED3]" />
                  <label className="text-sm font-medium text-gray-300">Account is Active (Can Login)</label>
                </div>
              </div>
            </div>

            {/* Role Specific Fields */}
            <div className="pt-4">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4 text-[#0A6ED3]">
                Role Specific Fields ({formData.role})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* STUDENT specific */}
                {formData.role === "STUDENT" && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Student ID</label>
                      <input required name="studentId" value={formData.studentId} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Batch Year</label>
                      <select required name="batchYear" value={formData.batchYear} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                        <option value="">Select Batch Year</option>
                        <option value="Y1">Y1</option>
                        <option value="Y2">Y2</option>
                        <option value="Y3">Y3</option>
                        <option value="Y4">Y4</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Faculty</label>
                      <select required name="faculty" value={formData.faculty} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                        <option value="">Select Faculty</option>
                        <option value="COMPUTING">COMPUTING</option>
                        <option value="BUSINESS">BUSINESS</option>
                        <option value="ENGINEERING">ENGINEERING</option>
                      </select>
                    </div>
                  </>
                )}

                {/* EMPLOYEES: LECTURER, MANAGER, TECHNICIAN share Employee ID */}
                {["LECTURER", "MANAGER", "TECHNICIAN"].includes(formData.role) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Employee ID</label>
                    <input required name="employeeId" value={formData.employeeId} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                  </div>
                )}

                {/* DEPARTMENT: Shared by STUDENT, LECTURER, MANAGER, TECHNICIAN */}
                {["STUDENT", "LECTURER", "MANAGER", "TECHNICIAN"].includes(formData.role) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Department</label>
                    <select required name="department" value={formData.department} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                      <option value="">Select Department</option>
                      <option value="IT">IT</option>
                      <option value="CS">CS</option>
                      <option value="SE">SE</option>
                      <option value="DS">DS</option>
                      <option value="CSNE">CSNE</option>
                      <option value="BUSINESS">BUSINESS</option>
                      <option value="ENGINEERING">ENGINEERING</option>
                      <option value="ADMINISTRATION">ADMINISTRATION</option>
                      <option value="OPERATIONS">OPERATIONS</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                      <option value="COMPUTING">COMPUTING</option>
                    </select>
                  </div>
                )}

                {/* SPECIALIZATION: Lecturer & Technician */}
                {["LECTURER", "TECHNICIAN"].includes(formData.role) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Specialization</label>
                    <input required name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                  </div>
                )}

                {/* DESIGNATION: Lecturer */}
                {formData.role === "LECTURER" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Designation</label>
                    <select required name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                      <option value="">Select Designation</option>
                      <option value="ASSISTANT_LECTURER">Assistant Lecturer</option>
                      <option value="SENIOR_LECTURER">Senior Lecturer</option>
                      <option value="LAB_ASSISTANT">Lab Assistant</option>
                    </select>
                  </div>
                )}

                {/* OFFICE LOCATION: Manager */}
                {formData.role === "MANAGER" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Office Location</label>
                    <input required name="officeLocation" value={formData.officeLocation} onChange={handleInputChange} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-white/10">
              <button disabled={loading} type="submit" className="w-full md:w-auto px-8 py-3 bg-[#0A6ED3] hover:bg-[#0855A6] text-white font-medium rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Adding User..." : "Add New User"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Edit User Modal */}
      <AdminEditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        onUpdateSuccess={fetchData}
      />

      {/* Admin View User Details Modal */}
      <AdminViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={viewingUser}
      />
    </div>
  );
}

export default AdminUserManagement;
