import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Switch, Space, Tag, Row, Col, Statistic } from 'antd';
import { useQuery } from 'react-query';
import { PlusOutlined, BellOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';

interface AlertRule {
  id: string;
  name: string;
  type: 'error' | 'performance' | 'custom';
  condition: string;
  threshold: number;
  status: boolean;
  notifyChannels: string[];
  createdAt: string;
}

interface AlertHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  type: 'error' | 'performance' | 'custom';
  message: string;
  status: 'triggered' | 'resolved';
  triggeredAt: string;
  resolvedAt?: string;
}

const POLLING_INTERVAL = 30000; // 30秒更新一次

const AlertsPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取告警规则列表
  const { data: rules, isLoading: rulesLoading } = useQuery<AlertRule[]>(
    'alert-rules',
    async () => {
      const response = await fetch('http://localhost:8000/api/alerts/rules');
      const data = await response.json();
      return data.data;
    }
  );

  // 获取告警历史记录
  const { data: history, isLoading: historyLoading } = useQuery<AlertHistory[]>(
    'alert-history',
    async () => {
      const response = await fetch('http://localhost:8000/api/alerts/history');
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  // 告警规则表格列配置
  const ruleColumns: TableProps<AlertRule>['columns'] = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'error' ? 'red' : type === 'performance' ? 'blue' : 'purple'}>
          {type === 'error' ? '错误告警' : type === 'performance' ? '性能告警' : '自定义告警'}
        </Tag>
      ),
    },
    {
      title: '条件',
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: '阈值',
      dataIndex: 'threshold',
      key: 'threshold',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Switch checked={status} onChange={(checked) => handleStatusChange(checked)} />
      ),
    },
    {
      title: '通知渠道',
      dataIndex: 'notifyChannels',
      key: 'notifyChannels',
      render: (channels: string[]) => (
        <>
          {channels.map((channel) => (
            <Tag key={channel}>{channel}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  // 告警历史表格列配置
  const historyColumns: TableProps<AlertHistory>['columns'] = [
    {
      title: '时间',
      dataIndex: 'triggeredAt',
      key: 'triggeredAt',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => dayjs(a.triggeredAt).unix() - dayjs(b.triggeredAt).unix(),
    },
    {
      title: '规则名称',
      dataIndex: 'ruleName',
      key: 'ruleName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'error' ? 'red' : type === 'performance' ? 'blue' : 'purple'}>
          {type === 'error' ? '错误告警' : type === 'performance' ? '性能告警' : '自定义告警'}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'triggered' ? 'red' : 'green'}>
          {status === 'triggered' ? '已触发' : '已解决'}
        </Tag>
      ),
    },
    {
      title: '解决时间',
      dataIndex: 'resolvedAt',
      key: 'resolvedAt',
      render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
  ];

  // 处理添加规则
  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // 处理编辑规则
  const handleEdit = (record: AlertRule) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 处理删除规则
  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/api/alerts/rules/${id}`, {
        method: 'DELETE',
      });
      // 刷新规则列表
    } catch (error) {
      console.error('删除规则失败:', error);
    }
  };

  // 处理规则状态变更
  const handleStatusChange = async (checked: boolean) => {
    // 实现状态变更逻辑
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      await fetch('http://localhost:8000/api/alerts/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      setIsModalVisible(false);
      // 刷新规则列表
    } catch (error) {
      console.error('保存规则失败:', error);
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总告警规则"
              value={rules?.length || 0}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="今日告警"
              value={history?.filter(h => dayjs(h.triggeredAt).isToday()).length || 0}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已解决"
              value={history?.filter(h => h.status === 'resolved').length || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="告警规则"
        style={{ marginTop: 16 }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            添加规则
          </Button>
        }
      >
        <Table
          columns={ruleColumns}
          dataSource={rules}
          loading={rulesLoading}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card title="告警历史" style={{ marginTop: 16 }}>
        <Table
          columns={historyColumns}
          dataSource={history}
          loading={historyLoading}
          rowKey="id"
          pagination={{
            total: history?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="告警规则配置"
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="告警类型"
            rules={[{ required: true, message: '请选择告警类型' }]}
          >
            <Select>
              <Select.Option value="error">错误告警</Select.Option>
              <Select.Option value="performance">性能告警</Select.Option>
              <Select.Option value="custom">自定义告警</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="condition"
            label="告警条件"
            rules={[{ required: true, message: '请输入告警条件' }]}
          >
            <Input placeholder="请输入告警条件" />
          </Form.Item>

          <Form.Item
            name="threshold"
            label="告警阈值"
            rules={[{ required: true, message: '请输入告警阈值' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="notifyChannels"
            label="通知渠道"
            rules={[{ required: true, message: '请选择通知渠道' }]}
          >
            <Select mode="multiple">
              <Select.Option value="email">邮件</Select.Option>
              <Select.Option value="dingtalk">钉钉</Select.Option>
              <Select.Option value="wecom">企业微信</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="启用状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AlertsPage; 