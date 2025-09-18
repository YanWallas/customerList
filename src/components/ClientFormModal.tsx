import React from 'react';
import { Modal, Form, Input } from 'antd';
import InputMask from 'react-input-mask';
import type { Client } from '../types';
import { validateCpfCnpj, validateEmail, validatePhone, onlyDigits } from '../utils/validators';

interface ClientFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: Omit<Client, 'id'>) => void;
  initialValues?: Client;
  title: string;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  title
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          label="Nome"
          name="name"
          rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
        >
          <Input placeholder="Nome completo ou razão social" />
        </Form.Item>

        <Form.Item
          label="CPF/CNPJ"
          name="cpfCnpj"
          rules={[
            { required: true, message: 'Por favor, insira o CPF ou CNPJ!' },
            {
              validator: (_, value) => {
                const digits = onlyDigits(value || '');
                return validateCpfCnpj(digits) 
                  ? Promise.resolve() 
                  : Promise.reject(new Error('CPF ou CNPJ inválido!'));
              }
            }
          ]}
        >
          <InputMask
            mask={form.getFieldValue('cpfCnpj')?.replace(/\D/g, '').length > 11 ? 
              "99.999.999/9999-99" : "999.999.999-99"}
          >
            {/* @ts-ignore */}
            {(inputProps: any) => <Input {...inputProps} placeholder="000.000.000-00 ou 00.000.000/0000-00" />}
          </InputMask>
        </Form.Item>

        <Form.Item
          label="Telefone"
          name="phone"
          rules={[
            { required: true, message: 'Por favor, insira o telefone!' },
            {
              validator: (_, value) => {
                const digits = onlyDigits(value || '');
                return validatePhone(digits) 
                  ? Promise.resolve() 
                  : Promise.reject(new Error('Telefone inválido!'));
              }
            }
          ]}
        >
          <InputMask mask="(99) 99999-9999">
            {(inputProps: any) => <Input {...inputProps} placeholder="(00) 00000-0000" />}
          </InputMask>
        </Form.Item>

        <Form.Item
          label="E-mail"
          name="email"
          rules={[
            { required: true, message: 'Por favor, insira o e-mail!' },
            {
              validator: (_, value) => {
                return validateEmail(value) 
                  ? Promise.resolve() 
                  : Promise.reject(new Error('E-mail inválido!'));
              }
            }
          ]}
        >
          <Input placeholder="cliente@email.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};