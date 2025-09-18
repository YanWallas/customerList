import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { validateEmail, validatePassword } from '../utils/validators';
import './Auth.css';

const { Title } = Typography;

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('As senhas não coincidem!');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      message.success('Conta criada com sucesso!');
      navigate('/login');
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
          <Title level={2}>Criar Conta</Title>
          <p>Preencha os dados abaixo para criar sua conta</p>
        </div>
        
        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Nome completo"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Seu nome completo" 
              size="large" 
            />
          </Form.Item>

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
              prefix={<MailOutlined />} 
              placeholder="seu@email.com" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[
              { required: true, message: 'Por favor, insira sua senha!' },
              { validator: (_, value) => 
                validatePassword(value) ? Promise.resolve() : Promise.reject(new Error('Senha deve ter pelo menos 6 caracteres!'))
              }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Sua senha" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Confirmar senha"
            name="confirmPassword"
            rules={[{ required: true, message: 'Por favor, confirme sua senha!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirme sua senha" 
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
              Criar Conta
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <span>Já tem uma conta? </span>
          <Link to="/login">Faça login</Link>
        </div>
      </Card>
    </div>
  );
};