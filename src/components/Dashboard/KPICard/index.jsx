import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, icon, color, trend, trendValue }) => {

  // fallback + formatting (safe)
  const displayValue = value || '0';

  return (
    <div 
      className="kpi-card"
      style={{
        transition: 'all 0.2s ease'
      }}
    >
      <div className="kpi-icon-row">
        <div 
          className="kpi-icon" 
          style={{ 
            backgroundColor: `${color}15`, 
            color: color 
          }}
        >
          {icon}
        </div>

        <div 
          className={`kpi-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue || 0}%
        </div>
      </div>

      <div>
        <div 
          className="kpi-value"
          style={{
            letterSpacing: '0.5px'
          }}
        >
          {displayValue}
        </div>

        <div 
          className="kpi-label"
          style={{
            marginTop: '2px'
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default KPICard;