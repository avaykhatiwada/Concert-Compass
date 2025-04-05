import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Event,
  People,
  AttachMoney,
  TrendingUp,
  MoreVert,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import EnhancedChart from './common/EnhancedChart';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: theme.palette.mode === 'dark' 
    ? 'rgba(25, 118, 210, 0.05)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.mode === 'dark' 
    ? 'rgba(25, 118, 210, 0.15)'
    : 'rgba(25, 118, 210, 0.1)'}`,
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${theme.palette.mode === 'dark' 
      ? 'rgba(25, 118, 210, 0.15)'
      : 'rgba(25, 118, 210, 0.12)'}`,
  },
}));

const StatCard = ({ title, value, icon, color }) => {
  const theme = useTheme();
  
  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

const StatusChip = styled(Chip)(({ theme, status }) => {
  const colors = {
    upcoming: theme.palette.info.main,
    active: theme.palette.primary.main,
    completed: theme.palette.success.main,
    cancelled: theme.palette.error.main,
  };

  return {
    backgroundColor: `${colors[status]}15`,
    color: colors[status],
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  };
});

function OrganizerDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const stats = [
    { title: 'Total Events', value: '124', icon: <Event sx={{ color: theme.palette.primary.main }} />, color: theme.palette.primary.main },
    { title: 'Total Attendees', value: '3,842', icon: <People sx={{ color: theme.palette.primary.main }} />, color: theme.palette.primary.main },
    { title: 'Revenue', value: '$48,295', icon: <AttachMoney sx={{ color: theme.palette.primary.main }} />, color: theme.palette.primary.main },
    { title: 'Growth', value: '+24%', icon: <TrendingUp sx={{ color: theme.palette.primary.main }} />, color: theme.palette.primary.main },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [30, 45, 35, 50, 49, 60],
  };

  const events = [
    { name: 'Tech Conference 2024', date: '2024-03-15', attendees: 450, status: 'upcoming' },
    { name: 'Summer Music Festival', date: '2024-06-20', attendees: 1200, status: 'active' },
    { name: 'Business Summit', date: '2024-04-10', attendees: 300, status: 'upcoming' },
    { name: 'Art Exhibition', date: '2024-05-05', attendees: 250, status: 'completed' },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Organizer Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            },
          }}
        >
          Create Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <EnhancedChart
                title="Event Attendance Trends"
                data={chartData.data}
                labels={chartData.labels}
              />
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {['Create Event', 'View Reports', 'Manage Team', 'Settings'].map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      borderRadius: 2,
                      py: 1,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderColor: theme.palette.primary.dark,
                        backgroundColor: `${theme.palette.primary.main}10`,
                      },
                    }}
                  >
                    {action}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.primary.main }}>
                Recent Events
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Attendees</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          '&:hover': {
                            backgroundColor: isDark 
                              ? 'rgba(25, 118, 210, 0.08)'
                              : 'rgba(25, 118, 210, 0.04)',
                          },
                        }}
                      >
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.date}</TableCell>
                        <TableCell>{event.attendees}</TableCell>
                        <TableCell>
                          <StatusChip
                            label={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            status={event.status}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton 
                            size="small" 
                            sx={{ 
                              mr: 1,
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: `${theme.palette.primary.main}15`,
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            sx={{ 
                              mr: 1,
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: `${theme.palette.error.main}15`,
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small"
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: `${theme.palette.primary.main}15`,
                              },
                            }}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OrganizerDashboard; 