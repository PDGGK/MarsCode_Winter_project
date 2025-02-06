import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { useQuery } from 'react-query';

interface PerformanceMetrics {
  FP: number;
  FCP: number;
  LCP: number;
  FID: number;
  CLS: number;
  TTFB: number;
  url: string;
  timestamp: string;
}

const PerformancePage: React.FC = () => {
  const { data: metrics, isLoading } = useQuery<PerformanceMetrics[]>(
    'performance',
    async () => {
      const response = await fetch('http://localhost:8000/api/events?event_name=performance');
      const data = await response.json();
      return data.data;
    }
  );

  const averageMetrics = metrics?.reduce(
    (acc, curr) => {
      acc.FP += curr.FP;
      acc.FCP += curr.FCP;
      acc.LCP += curr.LCP;
      acc.FID += curr.FID;
      acc.CLS += curr.CLS;
      acc.TTFB += curr.TTFB;
      return acc;
    },
    { FP: 0, FCP: 0, LCP: 0, FID: 0, CLS: 0, TTFB: 0 }
  );

  if (averageMetrics && metrics?.length) {
    Object.keys(averageMetrics).forEach((key) => {
      averageMetrics[key] = +(averageMetrics[key] / metrics.length).toFixed(2);
    });
  }

  const columns = [
    {
      title: '指标',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '平均值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `${value}ms`,
    },
    {
      title: '建议值',
      dataIndex: 'threshold',
      key: 'threshold',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record: any) => (
        record.value <= record.thresholdValue ? 
          <span style={{ color: '#52c41a' }}>良好</span> : 
          <span style={{ color: '#f5222d' }}>需优化</span>
      ),
    },
  ];

  const performanceData = averageMetrics ? [
    {
      name: 'First Paint (FP)',
      value: averageMetrics.FP,
      threshold: '< 1000ms',
      thresholdValue: 1000,
    },
    {
      name: 'First Contentful Paint (FCP)',
      value: averageMetrics.FCP,
      threshold: '< 1800ms',
      thresholdValue: 1800,
    },
    {
      name: 'Largest Contentful Paint (LCP)',
      value: averageMetrics.LCP,
      threshold: '< 2500ms',
      thresholdValue: 2500,
    },
    {
      name: 'First Input Delay (FID)',
      value: averageMetrics.FID,
      threshold: '< 100ms',
      thresholdValue: 100,
    },
    {
      name: 'Cumulative Layout Shift (CLS)',
      value: averageMetrics.CLS,
      threshold: '< 0.1',
      thresholdValue: 0.1,
    },
    {
      name: 'Time to First Byte (TTFB)',
      value: averageMetrics.TTFB,
      threshold: '< 600ms',
      thresholdValue: 600,
    },
  ] : [];

  return (
    <div>
      <Card title="性能监控">
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均首次绘制 (FP)"
                value={averageMetrics?.FP}
                suffix="ms"
                valueStyle={{ color: averageMetrics?.FP <= 1000 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均最大内容绘制 (LCP)"
                value={averageMetrics?.LCP}
                suffix="ms"
                valueStyle={{ color: averageMetrics?.LCP <= 2500 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="平均首次输入延迟 (FID)"
                value={averageMetrics?.FID}
                suffix="ms"
                valueStyle={{ color: averageMetrics?.FID <= 100 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
        <Table
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={performanceData}
          loading={isLoading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default PerformancePage; 