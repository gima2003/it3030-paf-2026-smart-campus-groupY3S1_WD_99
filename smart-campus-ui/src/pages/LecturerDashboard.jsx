import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function LecturerDashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Welcome, {user?.firstName}!</h1>
      <p className="text-gray-400 mb-8">This is your lecturer dashboard portal.</p>
      
      <div className="bg-[#001736] border border-white/5 p-6 rounded-2xl flex items-center justify-center min-h-[300px]">
        <h2 className="text-xl text-gray-400 font-medium">Dashboard under construction.</h2>
      </div>
    </div>
  );
}

export default LecturerDashboard;
