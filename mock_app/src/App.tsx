import React from 'react';
import { Button, Card, Layout, Space, Typography } from 'antd';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  // 触发一个错误
  const handleError = () => {
    throw new Error('测试错误');
  };

  // 触发一个Promise错误
  const handlePromiseError = () => {
    Promise.reject(new Error('测试Promise错误'));
  };

  // 触发一个自定义事件
  const handleCustomEvent = () => {
    // TODO: 使用SDK发送自定义事件
    console.log('发送自定义事件');
  };

  return (
    <Layout className="layout">
      <Header style={{ color: 'white' }}>
        <Title level={3} style={{ color: 'white', margin: '16px 0' }}>测试应用</Title>
      </Header>
      <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        <Card title="功能测试">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="错误监控测试" size="small">
              <Space>
                <Button danger onClick={handleError}>触发错误</Button>
                <Button danger onClick={handlePromiseError}>触发Promise错误</Button>
              </Space>
            </Card>
            
            <Card title="自定义事件测试" size="small">
              <Button type="primary" onClick={handleCustomEvent}>
                发送自定义事件
              </Button>
            </Card>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default App; 