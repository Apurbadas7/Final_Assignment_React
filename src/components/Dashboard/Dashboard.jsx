import React from 'react';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { 
    Activity, 
    CheckCircle, 
    Clock, 
    AlertCircle 
} from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import KPICard from './KPICard';
import TransactionTable from './TransactionTable';
import './Dashboard.css';

const data = [
  { name: 'Mon', value: 400 },
  { name: 'Tue', value: 300 },
  { name: 'Wed', value: 600 },
  { name: 'Thu', value: 800 },
  { name: 'Fri', value: 500 },
  { name: 'Sat', value: 900 },
  { name: 'Sun', value: 700 },
];

const Dashboard = () => {
    return (
        <div className="dashboard-shell">
            <Sidebar />
            
            <main className="main-wrapper">
                <Header />
                
                <div className="dashboard-content">
                    {/* KPI Section */}
                    <div className="kpi-grid">
                        <KPICard 
                            title="Total Transaction" 
                            value="12,540" 
                            icon={<Activity size={24} />} 
                            color="#004a8f" 
                            trend="up" 
                            trendValue="12.5"
                        />
                        <KPICard 
                            title="Total Success" 
                            value="11,210" 
                            icon={<CheckCircle size={24} />} 
                            color="#10b981" 
                            trend="up" 
                            trendValue="8.2"
                        />
                        <KPICard 
                            title="Total Processing" 
                            value="840" 
                            icon={<Clock size={24} />} 
                            color="#f59e0b" 
                            trend="down" 
                            trendValue="2.4"
                        />
                        <KPICard 
                            title="Total Failed" 
                            value="490" 
                            icon={<AlertCircle size={24} />} 
                            color="#ef4444" 
                            trend="up" 
                            trendValue="1.1"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Transaction Overview</h3>
                                <select style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>
                            <div style={{ height: '300px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#004a8f" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#004a8f" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 10%)' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#004a8f" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorValue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Status Ratio</h3>
                            </div>
                            {/* Placeholder for status distribution/pie chart */}
                            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>89%</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <TransactionTable />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
