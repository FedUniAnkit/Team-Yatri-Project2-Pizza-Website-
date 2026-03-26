import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import analyticsService from '../../services/analyticsService';
import './AdminAnalytics.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const [salesData, setSalesData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch sales data
        const salesResponse = await analyticsService.getSalesAnalytics(timeRange);
        setSalesData(salesResponse.data);
        
        // Fetch product data (top 10 products by default)
        const productsResponse = await analyticsService.getProductAnalytics(10, 'month');
        setProductData(productsResponse.data);
        
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Prepare sales chart data
  const salesChartData = {
    labels: salesData?.map(item => {
      const date = new Date(item.period);
      return timeRange === 'yearly' 
        ? date.getFullYear() 
        : timeRange === 'monthly'
        ? date.toLocaleString('default', { month: 'short', year: '2-digit' })
        : `Week ${date.getWeek()}, ${date.getFullYear()}`;
    }) || [],
    datasets: [
      {
        label: 'Total Sales ($)',
        data: salesData?.map(item => item.totalSales) || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Number of Orders',
        data: salesData?.map(item => item.orderCount) || [],
        type: 'line',
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  // Prepare product chart data
  const productChartData = {
    labels: productData?.map(item => item.productName) || [],
    datasets: [
      {
        label: 'Quantity Sold',
        data: productData?.map(item => item.totalQuantity) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Total Sales ($)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Number of Orders',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Sales Analytics',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label.includes('$')) {
              label += ': $' + context.parsed.y.toFixed(2);
            } else {
              label += ': ' + context.parsed.y;
            }
            return label;
          }
        }
      }
    },
  };

  const productChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top Selling Products',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity Sold',
        },
      },
    },
  };

  // Add getWeek method to Date prototype if it doesn't exist
  if (!Date.prototype.getWeek) {
    Date.prototype.getWeek = function() {
      const date = new Date(this.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
      const week1 = new Date(date.getFullYear(), 0, 4);
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };
  }

  return (
    <div className="admin-analytics-container">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="time-range-selector">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading analytics data...</div>
      ) : (
        <>
          <div className="chart-container">
            <div className="chart-card">
              <h3>Sales Overview</h3>
              <div className="chart-wrapper">
                <Line data={salesChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-card">
              <h3>Top Products</h3>
              <div className="chart-wrapper">
                <Bar data={productChartData} options={productChartOptions} />
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Revenue</h4>
              <p className="stat-value">
                ${salesData?.reduce((sum, item) => sum + parseFloat(item.totalSales || 0), 0).toFixed(2) || '0.00'}
              </p>
              <p className="stat-period">Past {timeRange}</p>
            </div>
            <div className="stat-card">
              <h4>Total Orders</h4>
              <p className="stat-value">
                {salesData?.reduce((sum, item) => sum + (parseInt(item.orderCount) || 0), 0) || 0}
              </p>
              <p className="stat-period">Past {timeRange}</p>
            </div>
            <div className="stat-card">
              <h4>Top Product</h4>
              <p className="stat-value">
                {productData?.[0]?.productName || 'N/A'}
              </p>
              <p className="stat-period">
                {productData?.[0]?.totalQuantity || 0} sold
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
