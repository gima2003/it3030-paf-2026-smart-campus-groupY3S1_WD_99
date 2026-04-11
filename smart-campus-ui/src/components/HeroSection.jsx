import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[#000919] overflow-hidden min-h-[90vh] flex items-center">
      
      {/* --- Background Animated Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Glow 1 */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] rounded-full bg-[#0A6ED3]/20 blur-[120px] animate-pulse pointer-events-none mix-blend-screen" style={{ animationDuration: '4s' }}></div>
        {/* Glow 2 */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px] animate-pulse pointer-events-none mix-blend-screen" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto w-full px-8 grid md:grid-cols-2 items-center gap-16 relative z-10 py-12">

        {/* Left Content */}
        <div className="space-y-8 max-w-2xl">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-blue-300 shadow-sm backdrop-blur-sm">
            🚀 The Future of Campus Management
          </div>
          
          <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
            Transforming Campus Management with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A6ED3] to-indigo-400"> Smart Digital Solutions</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light">
            A centralized system for booking facilities, tracking maintenance,
            and managing campus operations with secure role-based access control.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => navigate("/login")}
              className="bg-[#0A6ED3] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#0855A6] shadow-[0_4px_14px_0_rgba(10,110,211,0.39)] hover:shadow-[0_6px_20px_rgba(10,110,211,0.23)] hover:-translate-y-1 transition-all duration-300"
            >
              Get Started
            </button>

            <button className="bg-transparent border border-gray-600 text-gray-300 px-8 py-3.5 rounded-full font-semibold hover:bg-white/5 hover:border-gray-400 hover:text-white transition-all duration-300">
              Learn More
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 pt-6">
            <div className="flex -space-x-2">
               {/* Quick Mock Avatars */}
               <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#000919] z-30"></div>
               <div className="w-8 h-8 rounded-full bg-gray-600 border-2 border-[#000919] z-20"></div>
               <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#000919] z-10"></div>
            </div>
            <p>Trusted by 10,000+ Students & Staff</p>
          </div>
        </div>

        {/* Right Preview Card */}
        <div className="hidden md:block relative animate-in fade-in slide-in-from-right-8 duration-700 mt-10 md:mt-0">
          
          {/* Main Card Glass UI */}
          <div className="relative bg-[#0B152A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 transform md:rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
            
            {/* Subtle Inner Glow on Card */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0A6ED3]/30 blur-3xl group-hover:bg-[#0A6ED3]/50 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 relative z-10">
               <div className="flex space-x-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Admin Dashboard</div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
               {/* Mock Stat Widget 1 */}
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                 <div className="text-sm text-gray-400 mb-1">Active Tickets</div>
                 <div className="text-2xl font-bold text-white tracking-tight">124</div>
                 <div className="text-xs text-green-400 mt-2 font-medium">↑ 12% this week</div>
               </div>

               {/* Mock Stat Widget 2 */}
               <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                 <div className="text-sm text-gray-400 mb-1">Resolved Issues</div>
                 <div className="text-2xl font-bold text-[#0A6ED3] tracking-tight">98</div>
                 <div className="text-xs text-green-400 mt-2 font-medium">↑ 5% this week</div>
               </div>

               {/* Mock Graph Widget spans 2 cols */}
               <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/5 h-36 flex flex-col justify-end gap-1 items-end relative overflow-hidden group-hover:bg-white/10 transition-colors duration-300">
                 <div className="absolute top-4 left-4 text-sm font-medium text-gray-400">Activity Overview</div>
                 
                 {/* Fake Graph Bars */}
                 <div className="flex items-end gap-3 w-full h-[60px] pt-4 mt-auto">
                    <div className="w-full bg-[#0A6ED3]/30 rounded-t-sm h-[40%] group-hover:bg-[#0A6ED3]/40 transition-all duration-300"></div>
                    <div className="w-full bg-[#0A6ED3]/30 rounded-t-sm h-[70%] group-hover:bg-[#0A6ED3]/40 transition-all duration-300 delay-75"></div>
                    <div className="w-full bg-[#0A6ED3]/60 rounded-t-sm h-[50%] group-hover:bg-[#0A6ED3]/80 transition-all duration-300 delay-100"></div>
                    <div className="w-full bg-[#0A6ED3]/90 rounded-t-sm h-[100%] group-hover:bg-[#0A6ED3] transition-all duration-300 delay-150"></div>
                    <div className="w-full bg-[#0A6ED3]/40 rounded-t-sm h-[60%] group-hover:bg-[#0A6ED3]/60 transition-all duration-300 delay-200"></div>
                 </div>
               </div>
            </div>

          </div>

          {/* Floating UI Element Layered Below */}
          <div className="absolute -bottom-6 -left-8 md:-left-12 bg-[#121B31]/95 backdrop-blur-xl rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/10 flex items-center gap-4 animate-[bounce_3s_infinite_ease-in-out]">
             <div className="bg-green-500/20 p-2.5 rounded-xl border border-green-500/10">
                <span className="text-xl inline-block -translate-y-0.5">✅</span>
             </div>
             <div className="space-y-0.5 pr-2">
                <div className="text-sm font-bold text-white tracking-wide">System Secure</div>
                <div className="text-xs text-gray-400 font-medium">2FA protection active</div>
             </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HeroSection;