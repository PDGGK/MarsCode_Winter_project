import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Select, Spin } from 'antd';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { useQuery } from 'react-query';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface DashboardData {
  pv: number;
  uv: number;
  errorCount: number;
  performanceScore: number;
  pvGrowth: number;
  uvGrowth: number;
}

interface TrendData {
  date: string;
  value: number;
  type: string;
}

interface PerformanceData {
  type: string;
  value: number;
}

const POLLING_INTERVAL = 30000; // 30秒更新一次

export const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('today');

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardData>(
    ['dashboard-stats', timeRange],
    async () => {
      const response = await fetch(`http://localhost:8000/api/events/stats?range=${timeRange}`);
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const { data: trends, isLoading: trendsLoading } = useQuery<TrendData[]>(
    ['dashboard-trends', timeRange],
    async () => {
      const response = await fetch(`http://localhost:8000/api/events/trends?range=${timeRange}`);
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const { data: performance } = useQuery<PerformanceData[]>(
    'performance-distribution',
    async () => {
      const response = await fetch('http://localhost:8000/api/events/performance');
      const data = await response.json();
      return data.data;
    },
    {
      refetchInterval: POLLING_INTERVAL,
    }
  );

  const pvuvConfig = {
    data: trends || [],
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    tooltip: {
      showMarkers: true,
    },
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

  const errorConfig = {
    data: trends?.filter(item => item.type === 'error') || [],
    xField: 'date',
    yField: 'value',
    columnStyle: {
      fill: '#ff4d4f',
    },
    animation: {
      appear: {
        animation: 'scale-in-y',
        duration: 1000,
      },
    },
    label: {
      position: 'top',
      style: {
        fill: '#666',
      },
    },
  };

  const performanceConfig = {
    data: performance || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  const areaConfig = {
    data: trends?.filter(item => item.type === 'performance') || [],
    xField: 'date',
    yField: 'value',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
  };

  return (
    <div>
      <Row justify="end" style={{ marginBottom: 16 }}>
        <Select
          defaultValue="today"
          style={{ width: 120 }}
          onChange={setTimeRange}
          options={[
            { label: '今日', value: 'today' },
            { label: '本周', value: 'week' },
            { label: '本月', value: 'month' },
          ]}
        />
      </Row>

      <Spin spinning={statsLoading || trendsLoading}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日PV"
                value={stats?.pv || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={stats?.pvGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix={`${Math.abs(stats?.pvGrowth || 0)}%`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="今日UV"
                value={stats?.uv || 0}
                valueStyle={{ color: '#52c41a' }}
                prefix={stats?.uvGrowth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                suffix={`${Math.abs(stats?.uvGrowth || 0)}%`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="错误数"
                value={stats?.errorCount || 0}
                valueStyle={{ color: stats?.errorCount > 10 ? '#ff4d4f' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="性能分"
                value={stats?.performanceScore || 0}
                suffix="/100"
                valueStyle={{ color: (stats?.performanceScore || 0) >= 80 ? '#52c41a' : '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card title="访问趋势">
              <Line {...pvuvConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="错误趋势">
              <Column {...errorConfig} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={12}>
            <Card title="性能分布">
              <Pie {...performanceConfig} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="性能趋势">
              <Area {...areaConfig} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};