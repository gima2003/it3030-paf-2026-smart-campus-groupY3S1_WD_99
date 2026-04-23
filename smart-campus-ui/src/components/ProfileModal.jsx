import React, { useState, useEffect } from "react";
import { updateProfile } from "../services/userService";
import { useToast } from "../context/ToastContext";
import { validateName, validatePhone, validateCity, validateRequired } from "../utils/validation";

function ProfileModal({ isOpen, onClose, user, onUpdateSuccess }) {
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
        batchYear: user.batchYear || "",
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
      case "designation":
      case "specialization":
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

    if (user.role === "STUDENT") check("batchYear", formData.batchYear);
    if (user.role === "LECTURER") {
      check("designation", formData.designation);
      check("specialization", formData.specialization);
    }
    if (user.role === "TECHNICIAN") check("specialization", formData.specialization);
    if (user.role === "MANAGER") check("officeLocation", formData.officeLocation);

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
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
      const updatedUser = await updateProfile(payload);
      showToast("Profile updated successfully!", "success");
      onUpdateSuccess(updatedUser);
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine the specific ID label and value
  const getIdLabel = () => {
    if (user.role === "STUDENT") return { label: "Student ID", value: user.studentId };
    return { label: "Employee ID", value: user.employeeId };
  };

  const idInfo = getIdLabel();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0B1220] px-6 py-4 border-b border-white/10 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">👤</span> My Profile
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
            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-xs text-gray-500 mb-1">{idInfo.label}</label>
                <div className="text-gray-300 font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5 cursor-not-allowed">
                  {idInfo.value || "N/A"}
                </div>
              </div>
              {user.department && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Department</label>
                  <div className="text-gray-300 font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5 cursor-not-allowed">
                    {user.department}
                  </div>
                </div>
              )}
              {user.faculty && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Faculty</label>
                  <div className="text-gray-300 font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5 cursor-not-allowed">
                    {user.faculty}
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-[#0A6ED3] mt-2 italic flex items-center gap-1">
              <span>ℹ️</span> Cannot be changed by the user. Contact Admin.
            </p>
          </div>

          {/* Editable Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Editable Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-sm text-gray-300 mb-1">First Name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} onBlur={(e) => validateField("firstName", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Last Name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} onBlur={(e) => validateField("lastName", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Phone</label>
                <input required name="phone" value={formData.phone} onChange={handleChange} onBlur={(e) => validateField("phone", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} onBlur={(e) => validateField("city", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Editable Role Specifics */}
              {user.role === "STUDENT" && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Batch Year</label>
                  <select required name="batchYear" value={formData.batchYear} onChange={handleChange} onBlur={(e) => validateField("batchYear", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                    <option value="">Select Batch Year</option>
                    <option value="Y1">Y1</option>
                    <option value="Y2">Y2</option>
                    <option value="Y3">Y3</option>
                    <option value="Y4">Y4</option>
                  </select>
                  {errors.batchYear && <p className="text-red-400 text-xs mt-1">{errors.batchYear}</p>}
                </div>
              )}

              {user.role === "LECTURER" && (
                <>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Designation</label>
                    <select required name="designation" value={formData.designation} onChange={handleChange} onBlur={(e) => validateField("designation", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors">
                      <option value="">Select Designation</option>
                      <option value="ASSISTANT_LECTURER">Assistant Lecturer</option>
                      <option value="SENIOR_LECTURER">Senior Lecturer</option>
                      <option value="LAB_ASSISTANT">Lab Assistant</option>
                    </select>
                    {errors.designation && <p className="text-red-400 text-xs mt-1">{errors.designation}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Specialization</label>
                    <input required name="specialization" value={formData.specialization} onChange={handleChange} onBlur={(e) => validateField("specialization", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                    {errors.specialization && <p className="text-red-400 text-xs mt-1">{errors.specialization}</p>}
                  </div>
                </>
              )}

              {user.role === "TECHNICIAN" && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Specialization</label>
                  <input required name="specialization" value={formData.specialization} onChange={handleChange} onBlur={(e) => validateField("specialization", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                  {errors.specialization && <p className="text-red-400 text-xs mt-1">{errors.specialization}</p>}
                </div>
              )}

              {user.role === "MANAGER" && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Office Location</label>
                  <input required name="officeLocation" value={formData.officeLocation} onChange={handleChange} onBlur={(e) => validateField("officeLocation", e.target.value)} className="w-full bg-[#000919] border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#0A6ED3] transition-colors" />
                  {errors.officeLocation && <p className="text-red-400 text-xs mt-1">{errors.officeLocation}</p>}
                </div>
              )}

            </div>
          </div>

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
              className="px-6 py-2.5 bg-[#0A6ED3] hover:bg-[#0855A6] text-white font-medium rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default ProfileModal;
