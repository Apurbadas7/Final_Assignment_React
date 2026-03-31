import {
  LayoutDashboard,
  FileText,
  QrCode,
  Globe,
  HelpCircle
} from 'lucide-react';

const dashboard = {
  id: 'group-dashboard',
  title: null,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: LayoutDashboard,
      breadcrumbs: false
    },
    {
      id: 'transactions',
      title: 'Transaction Report',
      type: 'item',
      url: '/dashboard/transactions',
      icon: FileText
    },
    {
      id: 'qr-details',
      title: 'QR Details',
      type: 'item',
      url: '/dashboard/qr-details',
      icon: QrCode
    },
    {
      id: 'language',
      title: 'Language Update',
      type: 'item',
      url: '/dashboard/language',
      icon: Globe
    },
    {
      id: 'support',
      title: 'Help & Support',
      type: 'item',
      url: '/dashboard/support',
      icon: HelpCircle
    }
  ]
};

const menuItems = {
  items: [dashboard]
};

export default menuItems;
