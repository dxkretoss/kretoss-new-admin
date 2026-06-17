import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FileText, Settings, Users, FilePlus } from 'lucide-react';

// Placeholder Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Careers from './pages/Careers';
import Services from './pages/Services';
import ContactLeads from './pages/ContactLeads';
import JobApplications from './pages/JobApplications';

const SidebarItem = ({ icon: Icon, text, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-6 py-4 transition-colors ${isActive
        ? 'bg-blue-50 text-brand-dark border-r-4 border-brand-dark'
        : 'text-slate-500 hover:bg-slate-50 hover:text-brand-dark'
        }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{text}</span>
    </Link>
  );
};

const Layout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 shadow-lg flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-800"
          onClick={() => navigate('/dashboard')}>
          <img src="./kretoss-logo.svg" alt="" />
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" to="/dashboard" />
          <SidebarItem icon={Briefcase} text="Portfolios" to="/portfolios" />
          <SidebarItem icon={FileText} text="Careers" to="/careers" />
          <SidebarItem icon={Settings} text="Services" to="/services" />
          <SidebarItem icon={Users} text="Contact Leads" to="/leads" />
          <SidebarItem icon={FilePlus} text="Job Applications" to="/applications" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10">
          <h2 className="text-xl font-semibold text-slate-800">Admin Panel</h2>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-light to-brand-dark text-white flex items-center justify-center font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolios" element={<Portfolio />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/leads" element={<ContactLeads />} />
          <Route path="/applications" element={<JobApplications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
