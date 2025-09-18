import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  message,
  Typography,
  Popconfirm,
  Tag,
  Pagination
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import type { Client } from '../types';
import { clientsService } from '../services/clientService';
import { ClientFormModal } from '../components/ClientFormModal';

const { Title } = Typography;
const { Column } = Table;

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    setClients(clientsService.getClients());
  };

  const handleAdd = () => {
    setEditingClient(null);
    setModalVisible(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    clientsService.deleteClient(id);
    message.success('Cliente excluído com sucesso!');
    loadClients();
  };

  const handleSaveClient = (values: Omit<Client, 'id'>) => {
    try {
      if (editingClient) {
        clientsService.updateClient(editingClient.id, values);
        message.success('Cliente atualizado com sucesso!');
      } else {
        clientsService.createClient(values);
        message.success('Cliente criado com sucesso!');
      }
      setModalVisible(false);
      loadClients();
    } catch (error) {
      console.error('Falha ao salvar cliente:', error);
      message.error('Falha ao salvar cliente.');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };


  const paginatedClients = clients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalClients = clients.length;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalClients);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize) {
      setPageSize(newPageSize);
      setCurrentPage(1);
    }
  };

  return (
    <div className="clients-container">
      <div className="page-header">
        <div>
          <Title level={2} className="page-title">Clientes</Title>
          <p className="page-description">Gerencie seus clientes cadastrados</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="add-client-btn"
          size="large"
        >
          Novo Cliente
        </Button>
      </div>

      <div className="clients-table-container">
        <div className="clients-table-header">
          <h3 className="clients-table-title">Lista de Clientes</h3>
          <div className="clients-table-actions">
            <span>{totalClients} cliente(s) encontrado(s)</span>
          </div>
        </div>

        {/* Visualização desktop (table) */}
        <div className="clients-table-wrapper">
          <Table
            dataSource={paginatedClients}
            rowKey="id"
            className="clients-table"
            pagination={false}
          >
            <Column
              title="Nome"
              dataIndex="name"
              key="name"
              className="name-column"
              render={(text: string) => (
                <span style={{ wordBreak: 'break-word' }}>{text}</span>
              )}
            />
            <Column
              title="CPF/CNPJ"
              dataIndex="cpfCnpj"
              key="cpfCnpj"
              className="cpf-column"
            />
            <Column
              title="Telefone"
              dataIndex="phone"
              key="phone"
              className="phone-column"
            />
            <Column
              title="E-mail"
              dataIndex="email"
              key="email"
              className="email-column"
              render={(text: string) => (
                <span style={{ wordBreak: 'break-word' }}>{text}</span>
              )}
            />
            <Column
              title="Ações"
              key="actions"
              className="actions-column"
              render={(_: any, record: Client) => (
                <div className="actions-buttons">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                    className="edit-btn"
                  >
                    Editar
                  </Button>
                  <Popconfirm
                    title="Tem certeza que deseja excluir este cliente?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Sim"
                    cancelText="Não"
                    okType="danger"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      className="delete-btn"
                    >
                      Excluir
                    </Button>
                  </Popconfirm>
                </div>
              )}
            />
          </Table>

          {/* Paginação para desktop */}
          {totalClients > 0 && (
            <div className="clients-pagination">
              <div className="clients-pagination-info">
                Mostrando {startItem} a {endItem} de {totalClients} clientes
              </div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalClients}
                onChange={handlePageChange}
                onShowSizeChange={handlePageChange}
                showSizeChanger={true}
                pageSizeOptions={['10', '20', '50', '100']}
                showQuickJumper={true}
              />
            </div>
          )}
        </div>

        {/* Visualização mobile (cards) */}
        <div className="clients-mobile-view">
          {paginatedClients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-card-header">
                <h4 className="client-name">{client.name}</h4>
                <Tag color="blue">{client.cpfCnpj}</Tag>
              </div>
              
              <div className="client-details">
                <div className="client-detail">
                  <span className="client-detail-label">
                    <PhoneOutlined /> Tel:
                  </span>
                  <span className="client-detail-value">{client.phone}</span>
                </div>
                
                <div className="client-detail">
                  <span className="client-detail-label">
                    <MailOutlined /> Email:
                  </span>
                  <span className="client-detail-value">{client.email}</span>
                </div>
              </div>
              
              <div className="client-card-actions">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(client)}
                  className="edit-btn"
                  size="small"
                >
                  Editar
                </Button>
                <Popconfirm
                  title="Excluir cliente?"
                  onConfirm={() => handleDelete(client.id)}
                  okText="Sim"
                  cancelText="Não"
                >
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    className="delete-btn"
                    size="small"
                  >
                    Excluir
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}

          {/* Paginação para mobile */}
          {totalClients > 0 && (
            <div className="clients-pagination">
              <div className="clients-pagination-info">
                {startItem}-{endItem} de {totalClients}
              </div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalClients}
                onChange={handlePageChange}
                simple
                size="small"
              />
            </div>
          )}
        </div>
      </div>

      <ClientFormModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleSaveClient}
        initialValues={editingClient || undefined}
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
      />
    </div>
  );
};