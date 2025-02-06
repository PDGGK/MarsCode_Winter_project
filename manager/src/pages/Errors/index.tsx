import React, { useState } from 'react';
import { Card, Table, Tag, Space, DatePicker, Select, Row, Col, Statistic, Spin } from 'antd';
import type { TableProps } from 'antd';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { Line, Pie } from '@ant-design/charts';
import { WarningOutlined, BugOutlined, AlertOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface ErrorRecord {
  id: string;
  type: string;
  message: string;
  stack: string;
  timestamp: string;
  userAgent: string;
  url: string;
}

interface ErrorStats {
  totalErrors: number;
  criticalErrors: number;
  resolvedErrors: number;
  errorDistribution: Array<{
    type: string;
    count: number;
  }>;
  errorTrend: Array<{
    date: string;
    count: number;
  }>;
}

const POLLING_INTERVAL = 30000; // 30秒更新一次

const ErrorsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [errorType, setErrorType] = useState<string>('');

  const { data: errors, isLoading: errorsLoading } = useQuery<ErrorRecord[]>(
    ['errors', dateRange, errorType],
    async () => {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('start_date', dateRange[0].toISOString());
        params.append('end_date', dateRange[1].toISOString());
      }
      if (errorType) {
        params.append('type', errorType);
      }
      const response = await fetch(`http://localhost:8000/api/events?event_name=error&${params}`);
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const { data: stats, isLoading: statsLoading } = useQuery<ErrorStats>(
    ['error-stats', dateRange],
    async () => {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('start_date', dateRange[0].toISOString());
        params.append('end_date', dateRange[1].toISOString());
      }
      const response = await fetch(`http://localhost:8000/api/events/stats?event_name=error&${params}`);
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const columns: TableProps<ErrorRecord>['columns'] = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'error' ? 'red' : type === 'unhandledrejection' ? 'orange' : 'blue'}>
          {type}
        </Tag>
      ),
      filters: [
        { text: 'JavaScript错误', value: 'error' },
        { text: 'Promise错误', value: 'unhandledrejection' },
        { text: '资源加载错误', value: 'resource' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => console.log('查看详情', record)}>查看详情</a>
          <a onClick={() => console.log('标记已解决', record)}>标记已解决</a>
        </Space>
      ),
    },
  ];

  const pieConfig = {
    data: stats?.errorDistribution || [],
    angleField: 'count',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      { type: 'pie-legend-active' },
      { type: 'element-active' },
    ],
  };

  const lineConfig = {
    data: stats?.errorTrend || [],
    xField: 'date',
    yField: 'count',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#ff4d4f',
        lineWidth: 2,
      },
    },
  };

  return (
    <div>
      <Spin spinning={errorsLoading || statsLoading}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="总错误数"
                value={stats?.totalErrors || 0}
                prefix={<BugOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="严重错误"
                value={stats?.criticalErrors || 0}
                prefix={<AlertOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="已解决"
                value={stats?.resolvedErrors || 0}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="错误类型分布">
              <Pie {...pieConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="错误趋势">
              <Line {...lineConfig} />
            </Card>
          </Col>
        </Row>

        <Card
          title="错误列表"
          style={{ marginTop: 16 }}
          extra={
            <Space>
              <RangePicker
                showTime
                onChange={(dates) => {
                  if (dates) {
                    setDateRange([dates[0]!, dates[1]!]);
                  } else {
                    setDateRange(null);
                  }
                }}
              />
              <Select
                style={{ width: 200 }}
                placeholder="选择错误类型"
                allowClear
                onChange={setErrorType}
                options={[
                  { label: 'JavaScript错误', value: 'error' },
                  { label: 'Promise错误', value: 'unhandledrejection' },
                  { label: '资源加载错误', value: 'resource' },
                ]}
              />
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={errors}
            loading={errorsLoading}
            rowKey="id"
            pagination={{
              total: errors?.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条数据`,
            }}
          />
        </Card>
      </Spin>
    </div>
  );
};

export default ErrorsPage; 