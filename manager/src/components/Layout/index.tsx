import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { routes } from '../../routes';

const { Header, Sider, Content } = AntLayout;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = routes.map(route => ({
    key: route.path,
    label: route.name,
  }));

  return (
    <AntLayout style={{ height: '100%' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: '20px' }}>
          Heimdallr SDK Manager
        </div>
      </Header>
      <AntLayout>
        <Sider width={200}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content style={{ padding: '24px', minHeight: 280 }}>
          <Routes>
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}
          </Routes>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}; 