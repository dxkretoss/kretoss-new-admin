import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Briefcase, FileText, Settings, Users, FilePlus, LogOut, Bell, Search, ChevronRight } from 'lucide-react';

// Placeholder Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Careers from './pages/Careers';
import Services from './pages/Services';
import ContactLeads from './pages/ContactLeads';
import JobApplications from './pages/JobApplications';
import HireUs from './pages/HireUs';
import HireUsMenu from './pages/HireUsMenu';
// import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const SidebarItem = ({ icon: Icon, text, to, badge, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to + '/'));

  return (
    <Link
      to={to}
      title={!isOpen ? text : ''}
      className={`flex items-center justify-between py-3 rounded-[1.25rem] transition-all duration-500 ease-in-out group relative overflow-hidden ${isOpen ? 'px-6 mx-4' : 'px-0 mx-4 justify-center'} ${isActive ? 'bg-gradient-to-r from-blue-900/40 to-transparent border border-blue-400/30 text-[#44c7f6] font-bold shadow-[inset_0_0_20px_rgba(68,199,246,0.1)]' : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 font-medium'}`}
    >
      <div className={`flex items-center ${!isOpen ? 'justify-center w-full' : ''}`}>
        <Icon className={`w-5 h-5 shrink-0 transition-all duration-500 ease-in-out ${isActive ? 'scale-110' : 'group-hover:scale-110'} ${isOpen ? 'mr-3' : 'mr-0'}`} />
        <div className={`overflow-hidden transition-all duration-500 ease-in-out whitespace-nowrap ${isOpen ? 'max-w-[150px] opacity-100' : 'max-w-0 opacity-0'}`}>
          <span className="text-sm tracking-wide">{text}</span>
        </div>
      </div>

      {/* Right side indicators */}
      <div className={`flex items-center overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
        {badge && <span className="bg-[#44c7f6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">{badge}</span>}
        {isActive && !badge && <div className="w-1.5 h-1.5 rounded-full bg-[#44c7f6] shadow-[0_0_10px_rgba(68,199,246,0.8)] shrink-0"></div>}
      </div>
    </Link>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard Overview';
    if (path.includes('portfolios')) return 'Portfolios';
    if (path.includes('careers')) return 'Careers';
    if (path.includes('services')) return 'Services';
    if (path.includes('hire-us-menu')) return 'Hire Us Menu';
    if (path.includes('hire-us')) return 'Hire Us';
    if (path.includes('leads')) return 'Contact Leads';
    if (path.includes('applications')) return 'Job Applications';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden font-sans">
      {/* Sidebar - Premium Dark */}
      <div
        className={`${isSidebarOpen ? 'w-[260px]' : 'w-[88px]'} bg-[#0A101D] flex flex-col z-20 border-r border-slate-800/50 shadow-2xl relative overflow-visible transition-all duration-500 ease-in-out shrink-0 group/sidebar`}
      >

        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-16 w-7 h-7 bg-[#44c7f6] text-[#0A101D] rounded-full flex items-center justify-center z-50 shadow-[0_0_10px_rgba(68,199,246,0.5)] cursor-pointer border-2 border-[#0A101D]"
        >
          <ChevronRight className={`w-4 h-4 transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Decorative Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Subtle gradient glows */}
          <div className="absolute top-0 left-0 w-[250px] h-[250px] bg-[#44c7f6] rounded-full blur-[100px] opacity-10"></div>
          <div className="absolute bottom-10 right-0 w-[200px] h-[250px] bg-blue-500 rounded-full blur-[100px] opacity-15"></div>
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className={`h-20 flex items-center transition-all duration-500 ease-in-out ${isSidebarOpen ? 'px-8 justify-start' : 'px-0 justify-center'} border-b border-slate-800/50 cursor-pointer hover:bg-slate-800/30 relative z-10`}
          onClick={() => navigate('/dashboard')}>
          <div className={`relative w-full h-full flex items-center ${isSidebarOpen ? `justify-start` : `justify-center`}`}>
            <img src="/kretoss-logo.svg" alt="Kretoss" className={`absolute transition-all duration-500 ease-in-out origin-left ${isSidebarOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50 left-8'}`} />
            <img src="/meta-icon.png" alt="Kretoss" className={`absolute h-8 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`} onError={(e) => { e.target.onerror = null; e.target.src = "/favicon.ico"; }} />
          </div>
        </div>

        <div className="flex-1 py-4 overflow-x-hidden overflow-y-auto custom-scrollbar relative z-10 flex flex-col">
          <div className="space-y-1">
            <div className={`px-7 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-8 mb-3 opacity-100' : 'max-h-0 mb-0 opacity-0'}`}>Menu</div>

            <SidebarItem icon={LayoutDashboard} text="Dashboard" to="/dashboard" isOpen={isSidebarOpen} />
            <SidebarItem icon={Briefcase} text="Portfolios" to="/portfolios" isOpen={isSidebarOpen} />
            <SidebarItem icon={FileText} text="Careers" to="/careers" isOpen={isSidebarOpen} />
            <SidebarItem icon={Settings} text="Services" to="/services" isOpen={isSidebarOpen} />
            <SidebarItem icon={Briefcase} text="Hire Us" to="/hire-us" isOpen={isSidebarOpen} />
            <SidebarItem icon={Settings} text="Hire Us Menu" to="/hire-us-menu" isOpen={isSidebarOpen} />

            <div className={`px-7 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap transition-all duration-500 ease-in-out overflow-hidden ${isSidebarOpen ? 'max-h-8 mt-6 mb-3 opacity-100' : 'max-h-0 mt-3 mb-3 opacity-0 border-t border-slate-800/50 pt-0 mx-4'}`}>
              {isSidebarOpen ? 'Requests' : ''}
            </div>

            <SidebarItem icon={Users} text="Contact Leads" to="/leads" isOpen={isSidebarOpen} />
            <SidebarItem icon={FilePlus} text="Job Applications" to="/applications" isOpen={isSidebarOpen} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center text-slate-500 text-sm font-medium">
            <span className="hover:text-brand-dark transition-colors cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-300" />
            <span className="text-slate-800 font-semibold">{getPageTitle()}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-brand-light to-brand-dark p-[2px]">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=F4F7FB&color=0037f0" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-brand-dark transition-colors">Admin</p>
                  <p className="text-xs text-slate-500 mt-1">Superadmin</p>
                </div>
              </div>

              {/* Profile Dropdown Menu */}
              <div className="absolute right-0 top-full mt-4 w-48 bg-white rounded-xl shadow-premium border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 before:absolute before:-top-4 before:right-0 before:h-4 before:w-full">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-light/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        className: 'shadow-premium border border-slate-100',
        style: {
          background: '#ffffff',
          color: '#334155',
        },
      }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          {/* <Route element={<Layout />}> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolios" element={<Portfolio />} />
          <Route path="/portfolios/add" element={<Portfolio />} />
          <Route path="/portfolios/edit/:id" element={<Portfolio />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/add" element={<Careers />} />
          <Route path="/careers/edit/:id" element={<Careers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/add" element={<Services />} />
          <Route path="/services/edit/:id" element={<Services />} />
          <Route path="/hire-us" element={<HireUs />} />
          <Route path="/hire-us/add" element={<HireUs />} />
          <Route path="/hire-us/edit/:id" element={<HireUs />} />
          <Route path="/hire-us-menu" element={<HireUsMenu />} />
          <Route path="/leads" element={<ContactLeads />} />
          <Route path="/applications" element={<JobApplications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
