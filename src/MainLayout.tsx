import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Space, Typography, Button } from 'antd';
import { DashboardOutlined, TeamOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { authService } from './services/authService';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getLoggedUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: '/clients', icon: <TeamOutlined />, label: <Link to="/clients">Clientes</Link> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <Sider
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        width={250}
        collapsedWidth={0}
        trigger={null}
        style={{ position: 'fixed', zIndex: 100 }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">ERP</div>
          <h3 className="sidebar-title">Sistema ERP</h3>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={() => setSidebarOpen(false)} // fecha no mobile ao clicar
        />

        <div className="sidebar-footer">Sistema ERP v1.0 © 2025</div>
      </Sider>

      {/* Overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Layout principal */}
      <Layout className="main-content">
        <Header className="app-header">
          <Button
            type="text"
            icon={<MenuOutlined />}
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />

          <h2 className="header-title">
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/clients' && 'Gerenciamento de Clientes'}
          </h2>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Space className="user-menu" style={{ cursor: 'pointer' }}>
              <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
              <Text>{user?.name}</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content className="app-content"><Outlet /></Content>
      </Layout>
    </div>
  );
};
