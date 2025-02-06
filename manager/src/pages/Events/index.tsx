import React, { useState } from 'react';
import { Card, Table, Tag, Space, DatePicker, Select, Button, message, Row, Col, Statistic } from 'antd';
import type { TableProps } from 'antd';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { DownloadOutlined, LineChartOutlined } from '@ant-design/icons';
import { Line, Pie } from '@ant-design/charts';

const { RangePicker } = DatePicker;

interface EventRecord {
  id: string;
  eventName: string;
  projectId: string;
  userId: string;
  params: any;
  environment: any;
  timestamp: string;
}

interface EventStats {
  totalEvents: number;
  uniqueUsers: number;
  eventDistribution: Array<{
    type: string;
    count: number;
  }>;
  hourlyDistribution: Array<{
    hour: string;
    count: number;
  }>;
}

const POLLING_INTERVAL = 30000; // 30秒更新一次

const EventsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [eventType, setEventType] = useState<string>('');
  const [showCharts, setShowCharts] = useState(true);

  const { data: events, isLoading: eventsLoading } = useQuery<EventRecord[]>(
    ['events', dateRange, eventType],
    async () => {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('start_date', dateRange[0].toISOString());
        params.append('end_date', dateRange[1].toISOString());
      }
      if (eventType) {
        params.append('event_name', eventType);
      }
      const response = await fetch(`http://localhost:8000/api/events?${params}`);
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const { data: stats } = useQuery<EventStats>(
    ['event-stats', dateRange],
    async () => {
      const params = new URLSearchParams();
      if (dateRange) {
        params.append('start_date', dateRange[0].toISOString());
        params.append('end_date', dateRange[1].toISOString());
      }
      const response = await fetch(`http://localhost:8000/api/events/stats?${params}`);
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const columns: TableProps<EventRecord>['columns'] = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
      render: (text) => <Tag color="blue">{text}</Tag>,
      filters: [
        { text: '页面访问', value: 'page_view' },
        { text: '点击事件', value: 'click' },
        { text: '错误事件', value: 'error' },
        { text: '性能事件', value: 'performance' },
      ],
      onFilter: (value, record) => record.eventName === value,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      ellipsis: true,
    },
    {
      title: '项目ID',
      dataIndex: 'projectId',
      key: 'projectId',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => console.log('查看详情', record)}>查看详情</a>
        </Space>
      ),
    },
  ];

  const pieConfig = {
    data: stats?.eventDistribution || [],
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
    data: stats?.hourlyDistribution || [],
    xField: 'hour',
    yField: 'count',
    smooth: true,
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
  };

  const handleExport = () => {
    if (!events || events.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }
    message.success('开始导出数据');
    // TODO: 实现数据导出功能
  };

  return (
    <div>
      <Card
        title="事件管理"
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
              placeholder="选择事件类型"
              allowClear
              onChange={setEventType}
              options={[
                { label: '页面访问', value: 'page_view' },
                { label: '点击事件', value: 'click' },
                { label: '错误事件', value: 'error' },
                { label: '性能事件', value: 'performance' },
              ]}
            />
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExport}
              disabled={!events || events.length === 0}
            >
              导出数据
            </Button>
            <Button
              type="link"
              icon={<LineChartOutlined />}
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? '隐藏图表' : '显示图表'}
            </Button>
          </Space>
        }
      >
        {showCharts && (
          <>
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="总事件数"
                    value={stats?.totalEvents || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="独立用户数"
                    value={stats?.uniqueUsers || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="平均每用户事件数"
                    value={stats?.totalEvents && stats?.uniqueUsers
                      ? (stats.totalEvents / stats.uniqueUsers).toFixed(2)
                      : 0}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Card title="事件类型分布">
                  <Pie {...pieConfig} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="事件时间分布">
                  <Line {...lineConfig} />
                </Card>
              </Col>
            </Row>
          </>
        )}

        <Table
          columns={columns}
          dataSource={events}
          loading={eventsLoading}
          rowKey="id"
          pagination={{
            total: events?.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条数据`,
          }}
        />
      </Card>
    </div>
  );
};

export default EventsPage; 