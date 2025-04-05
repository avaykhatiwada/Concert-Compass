import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function EnhancedChart({ title, data, labels }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: data,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: isDark 
          ? 'rgba(33, 150, 243, 0.1)'
          : 'rgba(33, 150, 243, 0.1)',
        pointBackgroundColor: theme.palette.primary.main,
        pointBorderColor: isDark ? '#121212' : '#fff',
        pointHoverBackgroundColor: isDark ? '#121212' : '#fff',
        pointHoverBorderColor: theme.palette.primary.main,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#666',
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'white',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
        <Box sx={{ height: 400, position: 'relative' }}>
          <Line options={options} data={chartData} />
        </Box>
      </Paper>
    </motion.div>
  );
}

export default EnhancedChart; 