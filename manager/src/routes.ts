import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { Projects } from './pages/Projects';
import { Settings } from './pages/Settings';

export const routes = [
  {
    path: '/',
    name: '仪表盘',
    component: Dashboard,
  },
  {
    path: '/events',
    name: '事件管理',
    component: Events,
  },
  {
    path: '/projects',
    name: '项目管理',
    component: Projects,
  },
  {
    path: '/settings',
    name: '系统设置',
    component: Settings,
  },
]; 