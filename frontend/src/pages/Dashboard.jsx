import React, { useEffect, useState } from 'react';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import api from '../api';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useNavigate } from 'react-router-dom'; 

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [categoryData, setCategoryData] = useState({});
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const products = response.data;
      setTotalProducts(products.length);
      generateCategoryData(products);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const generateCategoryData = (products) => {
    const categoryCount = products.reduce((acc, product) => {
      const category = product.category || 'Other';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {});

    const categories = Object.keys(categoryCount);
    const counts = Object.values(categoryCount);
    const percentages = counts.map(count => ((count / products.length) * 100).toFixed(2));

    setCategoryData({
      labels: categories,
      datasets: [
        {
          label: 'Product Categories',
          data: counts,
          backgroundColor: ['#FF4F81', '#36A2EB', '#FFC658', '#4BC0C0', '#AF52DE', '#F38B40'],
          hoverBackgroundColor: ['#FF3671', '#1E90FF', '#FFA033', '#31A2A0', '#8A36CB', '#E76E20'],
          borderColor: '#333333',
          borderWidth: 2,
          hoverBorderColor: '#FFFFFF',
          hoverBorderWidth: 3,
        },
      ],
      percentages,
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#FFFFFF',
          font: {
            size: 14,
            family: 'Roboto, sans-serif',
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#2B2B2B',
        titleColor: '#FFFFFF',
        bodyColor: '#EAEAEA',
        borderColor: '#FF9F40',
        borderWidth: 2,
        callbacks: {
          label: (tooltipItem) => {
            const index = tooltipItem.dataIndex;
            const label = categoryData.labels[index];
            const count = categoryData.datasets[0].data[index];
            const percentage = categoryData.percentages[index];
            return `${label}: ${count} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#FFFFFF',
        },
        grid: {
          color: '#444444',
        },
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuad',
    },
  };

  const renderGraphData = () => (
    <div className="text-center mt-8">
      {categoryData.labels.map((label, index) => (
        <p key={index} className="text-gray-300 text-sm font-semibold">
          {label}: {categoryData.datasets[0].data[index]} products ({categoryData.percentages[index]}%)
        </p>
      ))}
    </div>
  );

  const renderChart = (ChartComponent, options) => (
    <div className="chart-container relative h-80">
      <ChartComponent data={categoryData} options={options} />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-10 px-6">

      {/* Logo Back Button at the Top Left */}
      <div className="absolute top-4 left-4">
        <button onClick={() => navigate('/')}>
          <img
            src='/logo.png' // Replace with the correct path to your logo
            alt='Logo'
            className='w-12 h-12 rounded-full'
          />
        </button>
      </div>

      <div className="bg-gray-800 w-full max-w-4xl p-8 rounded-lg shadow-xl mb-10">
        <p className="text-3xl text-white font-semibold mb-4">Dashboard Overview</p>
        <p className="text-xl text-white">Total Products: <span className="font-bold">{totalProducts}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300 ease-in-out">
          {categoryData.datasets ? renderChart(Pie, chartOptions) : <p className="text-white">Loading...</p>}
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300 ease-in-out">
          {categoryData.datasets ? renderChart(Bar, {
            ...chartOptions,
            scales: {
              y: { beginAtZero: true, ticks: { color: '#FFFFFF' }, grid: { color: '#444444' } },
              x: { ticks: { color: '#FFFFFF' }, grid: { display: false } },
            },
          }) : <p className="text-white">Loading...</p>}
        </div>

        {/* Doughnut Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300 ease-in-out">
          {categoryData.datasets ? renderChart(Doughnut, chartOptions) : <p className="text-white">Loading...</p>}
        </div>
      </div>

      {categoryData.datasets && renderGraphData()}
    </div>
  );
}

export default Dashboard;
