import React from 'react';
import { Card, Form, Input, Switch, InputNumber, Button, message } from 'antd';

interface SettingsForm {
  projectId: string;
  serverUrl: string;
  uploadPercent: number;
  enableBlankScreen: boolean;
  enablePerformance: boolean;
  errorThreshold: number;
  performanceThreshold: number;
}

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm<SettingsForm>();

  const onFinish = async (values: SettingsForm) => {
    try {
      // 这里应该调用API保存设置
      console.log('保存设置:', values);
      message.success('设置已保存');
    } catch (error) {
      message.error('保存设置失败');
    }
  };

  return (
    <div>
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            projectId: 'default',
            serverUrl: 'http://localhost:8000',
            uploadPercent: 100,
            enableBlankScreen: true,
            enablePerformance: true,
            errorThreshold: 10,
            performanceThreshold: 2000,
          }}
        >
          <Form.Item
            label="项目ID"
            name="projectId"
            rules={[{ required: true, message: '请输入项目ID' }]}
          >
            <Input placeholder="请输入项目ID" />
          </Form.Item>

          <Form.Item
            label="服务器地址"
            name="serverUrl"
            rules={[{ required: true, message: '请输入服务器地址' }]}
          >
            <Input placeholder="请输入服务器地址" />
          </Form.Item>

          <Form.Item
            label="上报采样率"
            name="uploadPercent"
            rules={[{ required: true, message: '请输入上报采样率' }]}
          >
            <InputNumber
              min={1}
              max={100}
              formatter={(value) => `${value}%`}
              parser={(value) => value!.replace('%', '')}
            />
          </Form.Item>

          <Form.Item
            label="启用白屏检测"
            name="enableBlankScreen"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="启用性能监控"
            name="enablePerformance"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="错误数量阈值"
            name="errorThreshold"
            tooltip="当错误数量超过此阈值时触发告警"
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="性能阈值(ms)"
            name="performanceThreshold"
            tooltip="当页面加载时间超过此阈值时触发告警"
          >
            <InputNumber min={100} step={100} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage; 