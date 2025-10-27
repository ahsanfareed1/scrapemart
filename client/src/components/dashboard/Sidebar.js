import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Package, 
  ShoppingCart,
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/dashboard/scraper', icon: Package, label: 'Shopify Scraper' },
    { path: '/dashboard/woocommerce-scraper', icon: ShoppingCart, label: 'WooCommerce Scraper' },
    { path: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {isOpen && <img src="/white_logo.png" alt="ScrapeMart" className="sidebar-logo" />}
          <button className="sidebar-toggle" onClick={onToggle}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {isOpen && profile && (
            <div className="user-info">
              <div className="user-avatar">
                {profile.full_name?.charAt(0) || 'U'}
              </div>
              <div className="user-details">
                <p className="user-name">{profile.full_name || 'User'}</p>
                <p className="user-plan">{profile.subscription_tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</p>
              </div>
            </div>
          )}
          <button className="sidebar-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onToggle} />
      )}
    </>
  );
};

export default Sidebar;




