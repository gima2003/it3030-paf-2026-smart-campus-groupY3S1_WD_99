import React from "react";

const AdminViewUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN": return "bg-red-500/20 text-red-500 border-red-500/30";
      case "STUDENT": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "LECTURER": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "TECHNICIAN": return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      default: return "bg-blue-500/20 text-blue-500 border-blue-500/30";
    }
  };

  const DetailRow = ({ label, value }) => (
    <div className="flex flex-col mb-3">
      <span className="text-sm text-gray-400 font-medium mb-1">{label}</span>
      <span className="text-white font-medium bg-[#000919] px-3 py-2 rounded-lg border border-white/5 break-words">
        {value || <span className="text-gray-500 italic">Not Provided</span>}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0B1220] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#000919]/50">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              User Details
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${user.isActive ? "bg-green-500/10 text-green-500 border-green-500/30" : "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
                {user.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="space-y-6">
            
            {/* Common Details */}
            <div>
              <h3 className="text-[#0A6ED3] text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-white/10 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <DetailRow label="First Name" value={user.firstName} />
                <DetailRow label="Last Name" value={user.lastName} />
                <DetailRow label="Email Address" value={user.email} />
                <DetailRow label="Phone Number" value={user.phone} />
                <DetailRow label="City" value={user.city} />
              </div>
            </div>

            {/* Role Specific Details */}
            <div>
              <h3 className="text-[#0A6ED3] text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b border-white/10 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Role Specific Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                
                {user.role === "STUDENT" && (
                  <>
                    <DetailRow label="Student ID" value={user.studentId} />
                    <DetailRow label="Batch Year" value={user.batchYear} />
                    <DetailRow label="Faculty" value={user.faculty} />
                    <DetailRow label="Department" value={user.department} />
                  </>
                )}

                {user.role === "LECTURER" && (
                  <>
                    <DetailRow label="Employee ID" value={user.employeeId} />
                    <DetailRow label="Department" value={user.department} />
                    <DetailRow label="Designation" value={user.designation} />
                    <DetailRow label="Specialization" value={user.specialization} />
                  </>
                )}

                {user.role === "TECHNICIAN" && (
                  <>
                    <DetailRow label="Employee ID" value={user.employeeId} />
                    <DetailRow label="Department" value={user.department} />
                    <DetailRow label="Specialization" value={user.specialization} />
                  </>
                )}

                {user.role === "MANAGER" && (
                  <>
                    <DetailRow label="Employee ID" value={user.employeeId} />
                    <DetailRow label="Department" value={user.department} />
                    <DetailRow label="Office Location" value={user.officeLocation} />
                  </>
                )}

                {user.role === "ADMIN" && (
                  <>
                    {user.employeeId && <DetailRow label="Employee ID" value={user.employeeId} />}
                    {user.department && <DetailRow label="Department" value={user.department} />}
                    {(!user.employeeId && !user.department) && (
                      <div className="col-span-2 text-gray-400 italic text-sm">
                        No additional role-specific details available for this admin.
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#000919]/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewUserModal;
