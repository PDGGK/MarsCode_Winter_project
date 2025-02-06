import React, { useEffect } from 'react';
import { Card, Row, Col, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import trackSDK from '@heimdallr-sdk/browser';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 初始化SDK
    trackSDK.init({
      projectId: 'test-project',
      serverUrl: 'http://localhost:8000'
    });

    // 添加通用参数
    trackSDK.addCommonParams({
      platform: 'web',
      version: '1.0.0'
    });

    // 发送页面访问事件
    trackSDK.sendEvent('page_view', {
      page: 'home'
    });
  }, []);

  const handleButtonClick = async () => {
    try {
      // 发送按钮点击事件
      await trackSDK.sendEvent('button_click', {
        button_name: 'browse_products',
        from_page: 'home'
      });
      
      message.success('事件已上报');
      navigate('/products');
    } catch (error) {
      message.error('事件上报失败');
      console.error('Failed to send event:', error);
    }
  };

  // 故意制造一个错误，测试错误捕获
  const triggerError = () => {
    try {
      throw new Error('This is a test error');
    } catch (error) {
      message.error('错误已被捕获并上报');
    }
  };

  return (
    <div className="container">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="欢迎来到示例商城">
            <p>这是一个用于演示埋点功能的示例应用。</p>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={handleButtonClick} style={{ marginRight: 8 }}>
                浏览商品
              </Button>
              <Button onClick={triggerError}>
                触发测试错误
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 