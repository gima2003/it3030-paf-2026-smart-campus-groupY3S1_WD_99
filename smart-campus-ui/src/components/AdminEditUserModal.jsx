import React, { useState, useEffect } from "react";
import { updateUserByAdmin } from "../services/userService";
import { useToast } from "../context/ToastContext";
import { validateName, validatePhone, validateCity, validateRequired } from "../utils/validation";

function AdminEditUserModal({ isOpen, onClose, user, onUpdateSuccess }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        city: user.city || "",
        isActive: user.isActive,
        batchYear: user.batchYear || "",
        faculty: user.faculty || "",
        department: user.department || "",
        specialization: user.specialization || "",
        designation: user.designation || "",
        officeLocation: user.officeLocation || ""
      });
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        error = validateName(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "city":
        error = validateCity(value);
        break;
      case "batchYear":
      case "faculty":
      case "department":
      case "specialization":
      case "designation":
      case "officeLocation":
        error = validateRequired(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    let isValid = true;
    const check = (name, value) => {
      if (!validateField(name, value)) isValid = false;
    };

    check("firstName", formData.firstName);
    check("lastName", formData.lastName);
    check("phone", formData.phone);
    check("city", formData.city);

    if (user.role !== "ADMIN") {
      if (user.role === "STUDENT") {
        check("batchYear", formData.batchYear);
        check("faculty", formData.faculty);
      }
      if (["STUDENT", "LECTURER", "MANAGER", "TECHNICIAN"].includes(user.role)) {
        check("department", formData.department);
      }
      if (["LECTURER", "TECHNICIAN"].includes(user.role)) {
        check("specialization", formData.specialization);
      }
      if (user.role === "LECTURER") {
        check("designation", formData.designation);
      }
      if (user.role === "MANAGER") {
        check("officeLocation", formData.officeLocation);
      }
    }

    return isValid;
  };

  const handleInputChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const name = e.target.name;
    setFormData({ ...formData, [name]: value });
    if (e.target.type !== "checkbox") {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the errors before submitting", "error");
      return;
    }

    setLoading(true);
    
    // Clean up empty strings
    const payload = { ...formData };
    Object.keys(payload).forEach(key => {
        if (payload[key] === "") payload[key] = null;
    });

    try {
      await updateUserByAdmin(user.id, payload);
      showToast("User updated successfully!", "success");
      onUpdateSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0B1220] px-6 py-4 border-b border-white/10 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">✏️</span> Edit User: {user.firstName} {user.lastName}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Lcoked Identity Information */}
          <div className="bg-[#000919] p-4 rounded-xl border border-white/5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Locked Identity Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <div className="text-gray-300 font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5 cursor-not-allowed">
                  {user.email}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Role</label>
                <div className="text-gray-300 font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5 cursor-not-allowed">
                  {user.role}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Identity ID</label>
                <div className="text-gray-300 font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5 cursor-not-allowed">
                  {user.studentId || user.employeeId || "N/A"}
                </div>
              </div>
            </div>
            <p className="text-xs text-[#0A6ED3] mt-2 italic flex items-center gap-1">
              <span>ℹ️</span> Unique identity fields cannot be changed.
            </p>
          </div>

          {/* Common Details */}
          <div>
            <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4 text-[#0A6ED3]">Common User Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1">First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleInputChange} onBlur={(e) => validateField("firstName", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleInputChange} onBlur={(e) => validateField("lastName", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone</label>
                <input required name="phone" value={formData.phone} onChange={handleInputChange} onBlur={(e) => validateField("phone", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">City</label>
                <input required name="city" value={formData.city} onChange={handleInputChange} onBlur={(e) => validateField("city", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="w-5 h-5 text-[#0A6ED3] bg-[#000919] border-white/10 rounded focus:ring-[#0A6ED3]" />
                <label className="text-sm font-medium text-gray-300">Account is Active (Can Login)</label>
              </div>
            </div>
          </div>

          {/* Role Specific Fields */}
          {user.role !== "ADMIN" && (
            <div className="pt-4">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2 mb-4 text-[#0A6ED3]">
                Role Specific Fields ({user.role})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* STUDENT specific */}
                {user.role === "STUDENT" && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Batch Year</label>
                      <select required name="batchYear" value={formData.batchYear} onChange={handleInputChange} onBlur={(e) => validateField("batchYear", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                        <option value="">Select Batch Year</option>
                        <option value="Y1">Y1</option>
                        <option value="Y2">Y2</option>
                        <option value="Y3">Y3</option>
                        <option value="Y4">Y4</option>
                      </select>
                      {errors.batchYear && <p className="text-red-400 text-xs mt-1">{errors.batchYear}</p>}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Faculty</label>
                      <select required name="faculty" value={formData.faculty} onChange={handleInputChange} onBlur={(e) => validateField("faculty", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                        <option value="">Select Faculty</option>
                        <option value="COMPUTING">COMPUTING</option>
                        <option value="BUSINESS">BUSINESS</option>
                        <option value="ENGINEERING">ENGINEERING</option>
                      </select>
                      {errors.faculty && <p className="text-red-400 text-xs mt-1">{errors.faculty}</p>}
                    </div>
                  </>
                )}

                {/* DEPARTMENT: Shared by STUDENT, LECTURER, MANAGER, TECHNICIAN */}
                {["STUDENT", "LECTURER", "MANAGER", "TECHNICIAN"].includes(user.role) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Department</label>
                    <select required name="department" value={formData.department} onChange={handleInputChange} onBlur={(e) => validateField("department", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
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
                    {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
                  </div>
                )}

                {/* SPECIALIZATION: Lecturer & Technician */}
                {["LECTURER", "TECHNICIAN"].includes(user.role) && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Specialization</label>
                    <input required name="specialization" value={formData.specialization} onChange={handleInputChange} onBlur={(e) => validateField("specialization", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                    {errors.specialization && <p className="text-red-400 text-xs mt-1">{errors.specialization}</p>}
                  </div>
                )}

                {/* DESIGNATION: Lecturer */}
                {user.role === "LECTURER" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Designation</label>
                    <select required name="designation" value={formData.designation} onChange={handleInputChange} onBlur={(e) => validateField("designation", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                      <option value="">Select Designation</option>
                      <option value="ASSISTANT_LECTURER">Assistant Lecturer</option>
                      <option value="SENIOR_LECTURER">Senior Lecturer</option>
                      <option value="LAB_ASSISTANT">Lab Assistant</option>
                    </select>
                    {errors.designation && <p className="text-red-400 text-xs mt-1">{errors.designation}</p>}
                  </div>
                )}

                {/* OFFICE LOCATION: Manager */}
                {user.role === "MANAGER" && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Office Location</label>
                    <input required name="officeLocation" value={formData.officeLocation} onChange={handleInputChange} onBlur={(e) => validateField("officeLocation", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                    {errors.officeLocation && <p className="text-red-400 text-xs mt-1">{errors.officeLocation}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 border-t border-white/10 mt-6 bg-[#0B1220] py-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              disabled={loading} 
              type="submit" 
              className="px-6 py-2.5 bg-[#0A6ED3] hover:bg-[#0855A6] text-white font-medium rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AdminEditUserModal;
