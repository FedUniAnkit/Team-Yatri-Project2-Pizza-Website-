import React, { useState, useEffect, useMemo } from 'react';
import analyticsService from '../../services/analyticsService';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from 'react-toastify';
import { FiBox, FiUsers, FiMail, FiTag, FiTrendingUp, FiShoppingBag, FiDollarSign, FiActivity } from 'react-icons/fi';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [productChartData, setProductChartData] = useState(null);
  const [productList, setProductList] = useState([]);
  const [trendData, setTrendData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesPeriod, setSalesPeriod] = useState('monthly');
  const [productPeriod, setProductPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [salesRes, productRes, trendRes, statsRes] = await Promise.all([
          analyticsService.getSalesAnalytics(salesPeriod),
          analyticsService.getProductAnalytics(100, productPeriod),
          analyticsService.getProductTrends(5, productPeriod),
          analyticsService.getDashboardStats(),
        ]);

        if (salesRes.success) {
          setSalesData(formatSalesData(salesRes.data, salesPeriod));
        } else {
          toast.error('Failed to load sales data.');
        }

        if (productRes.success) {
          setProductList(productRes.data || []);
          setProductChartData(formatProductData(productRes.data));
        } else {
          toast.error('Failed to load product data.');
        }

        if (trendRes.success) {
          setTrendData(trendRes.data);
        }

        if (statsRes.success) {
          setDashboardStats(statsRes.data);
        }

      } catch (error) {
        toast.error('An error occurred while fetching dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [salesPeriod, productPeriod]);

  const formatSalesData = (data, period) => {
    const labels = data.map(d => {
      const date = new Date(d.period);
      if (period === 'weekly') return date.toLocaleDateString(undefined, { weekday: 'short' });
      if (period === 'yearly') return date.toLocaleDateString(undefined, { month: 'short' });
      return date.getDate().toString();
    });
    const sales = data.map(d => parseFloat(d.totalSales) || 0);
    const orders = data.map(d => parseInt(d.orderCount) || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Total Sales ($)',
          data: sales,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Number of Orders',
          data: orders,
          borderColor: '#f43f5e',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          pointBackgroundColor: '#f43f5e',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    };
  };

  const formatProductData = (data = []) => {
    const topTen = data.slice(0, 10);
    const labels = topTen.map(p => p.productName);
    const quantities = topTen.map(p => p.totalQuantity);

    return {
      labels,
      datasets: [
        {
          label: 'Units Sold',
          data: quantities,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
        },
      ],
    };
  };

  const now = new Date();
  const periodLabel = salesPeriod === 'weekly'
    ? `This Week (${now.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} week)`
    : salesPeriod === 'yearly'
    ? `${now.getFullYear()}`
    : now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { usePointStyle: true, padding: 20 } },
      title: {
        display: true,
        text: `Sales Performance — ${periodLabel}`,
        font: { size: 15, weight: '600' },
        padding: { bottom: 16 },
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const label = ctx.dataset.label || '';
            const val = ctx.parsed.y;
            return label.includes('$') ? `  ${label}: $${val.toFixed(2)}` : `  ${label}: ${val}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { maxRotation: 45, font: { size: 11 } },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.06)' },
        title: { display: true, text: 'Sales ($)', font: { size: 12 } },
        ticks: { callback: v => `$${v}` },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Orders', font: { size: 12 } },
        ticks: { stepSize: 1 },
      },
    },
  };

  const productOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Products',
      },
    },
  };

  const quickLinks = useMemo(() => ([
    { label: 'Manage Products', href: '/admin/products', icon: <FiBox /> },
    { label: 'Manage Users', href: '/admin/users', icon: <FiUsers /> },
    { label: 'Newsletter', href: '/admin/newsletter', icon: <FiMail /> },
    { label: 'Promo Banners', href: '/admin/promo-banners', icon: <FiActivity /> },
    { label: 'Promo Codes', href: '/admin/promotions', icon: <FiTag /> },
    { label: 'Orders Board', href: '/staff/orders', icon: <FiShoppingBag /> },
  ]), []);

  const statCards = useMemo(() => {
    if (!dashboardStats) return [];
    return [
      {
        label: 'Total Orders',
        value: dashboardStats.totalOrders,
        caption: 'Lifetime',
        accent: '#7c3aed',
        icon: <FiShoppingBag />,
      },
      {
        label: 'Total Revenue',
        value: `$${dashboardStats.totalRevenue.toFixed(2)}`,
        caption: 'Since launch',
        accent: '#0ea5e9',
        icon: <FiDollarSign />,
      },
      {
        label: 'This Month',
        value: `$${dashboardStats.monthRevenue.toFixed(2)}`,
        caption: 'Month-to-date',
        accent: '#22c55e',
        icon: <FiTrendingUp />,
      },
      {
        label: 'Customers',
        value: dashboardStats.totalCustomers,
        caption: 'Active profiles',
        accent: '#f97316',
        icon: <FiUsers />,
      },
      {
        label: 'Pending Orders',
        value: dashboardStats.pendingOrders,
        caption: 'Need attention',
        accent: '#ef4444',
        icon: <FiActivity />,
      },
      {
        label: "Today's Orders",
        value: dashboardStats.todayOrders,
        caption: 'Since midnight',
        accent: '#14b8a6',
        icon: <FiBox />,
      },
    ];
  }, [dashboardStats]);

  if (isLoading) {
    return (
      <div className="admin-dashboard loading-state">
        <p>Pulling fresh insights…</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Operations Center</p>
          <h1>Analytics Dashboard</h1>
          <p className="hero-subtitle">Track revenue, orders, and product momentum across Komorebi Pizza.</p>
        </div>
      </div>

      <div className="quick-actions">
        {quickLinks.map((link) => (
          <a key={link.label} href={link.href} className="quick-action-card">
            <span className="quick-icon">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      {statCards.length > 0 && (
        <div className="stat-grid">
          {statCards.map((card) => (
            <div key={card.label} className="stat-card">
              <div className="stat-icon" style={{ background: card.accent }}>{card.icon}</div>
              <div className="stat-meta">
                <p className="stat-label">{card.label}</p>
                <h3>{card.value}</h3>
                <span className="stat-caption">{card.caption}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="chart-container sales-chart">
          <div className="chart-header">
            <h3>Sales Analytics</h3>
            <select value={salesPeriod} onChange={(e) => setSalesPeriod(e.target.value)} className="period-select">
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          {salesData ? (
            <div className="chart-viewport">
              <Line options={salesOptions} data={salesData} />
            </div>
          ) : (
            <p>No sales data available.</p>
          )}
        </div>
        <div className="chart-container product-chart">
          <div className="chart-header">
            <h3>Top Products</h3>
            <select value={productPeriod} onChange={(e) => setProductPeriod(e.target.value)} className="period-select">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          {productChartData ? (
            <div className="chart-viewport">
              <Bar options={productOptions} data={productChartData} />
            </div>
          ) : (
            <p>No product data available.</p>
          )}
        </div>
        {productList.length > 0 && (
          <div className="chart-container product-table">
            <div className="chart-header">
              <h3>All Products — Units Sold</h3>
              <span className="table-caption">Sorted by quantity ({productPeriod})</span>
            </div>
            <div className="product-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Revenue ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item, idx) => (
                    <tr key={`${item.productName}-${idx}`}>
                      <td>{idx + 1}</td>
                      <td>{item.productName}</td>
                      <td>{item.totalQuantity}</td>
                      <td>{Number(item.totalRevenue).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {trendData && (
          <div className="chart-container trend-card">
            <div className="chart-header">
              <h3>Risers & Decliners</h3>
              <select value={productPeriod} onChange={(e) => setProductPeriod(e.target.value)} className="period-select">
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="trend-grid">
              <div>
                <p className="trend-label">Top Risers</p>
                {trendData.movers.length === 0 && <p className="trend-empty">No data available.</p>}
                {trendData.movers.map((item) => (
                  <div key={`mover-${item.productName}`} className="trend-row">
                    <div>
                      <strong>{item.productName}</strong>
                      <span className="trend-sub">{item.totalQuantity} sold</span>
                    </div>
                    <span className="trend-up">+{item.change} ({item.percentChange}%)</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="trend-label">Top Decliners</p>
                {trendData.decliners.length === 0 && <p className="trend-empty">No data available.</p>}
                {trendData.decliners.map((item) => (
                  <div key={`decliner-${item.productName}`} className="trend-row">
                    <div>
                      <strong>{item.productName}</strong>
                      <span className="trend-sub">{item.previousQuantity} → {item.totalQuantity}</span>
                    </div>
                    <span className="trend-down">{item.change} ({item.percentChange}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
