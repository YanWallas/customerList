import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validators';
import './Auth.css';

const { Title } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await authService.login(values);
      message.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={2}>Login</Title>
          <p>Entre com suas credenciais para acessar o sistema</p>
        </div>
        
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu e-mail!' },
              { validator: (_, value) => 
                validateEmail(value) ? Promise.resolve() : Promise.reject(new Error('E-mail inválido!'))
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="seu@email.com" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Sua senha" 
              size="large" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <span>Não tem uma conta? </span>
          <Link to="/register">Cadastre-se</Link>
        </div>
      </Card>
    </div>
  );
};