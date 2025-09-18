import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Card } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { clientsService } from '../services/clientService';
import { authService } from '../services/authService';

const { Title } = Typography;

export const Dashboard: React.FC = () => {
  const [clientCount, setClientCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const totalClients = clientsService.getClients().length;
    const totalUsers = authService.getUsers().length;
    setClientCount(totalClients);
    setUserCount(totalUsers);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div>
          <Title level={2} className="page-title">Dashboard</Title>
          <p className="page-description">Visão geral do seu sistema</p>
        </div>
      </div>

      <Row gutter={[24, 24]} className="dashboard-cards">
        <Col xs={24} sm={12} lg={8}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Total de Clientes</h3>
              <div className="dashboard-card-icon">
                <TeamOutlined />
              </div>
            </div>
            <h2 className="dashboard-card-value">{clientCount}</h2>
            <p className="dashboard-card-footer">Clientes cadastrados</p>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Total de Usuários</h3>
              <div className="dashboard-card-icon">
                <UserOutlined />
              </div>
            </div>
            <h2 className="dashboard-card-value">{userCount}</h2>
            <p className="dashboard-card-footer">Usuários no sistema</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};