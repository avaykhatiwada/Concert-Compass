import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  styled,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Remove,
  Receipt,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  borderRadius: theme.spacing(2),
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(3),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const WalletDashboard = () => {
  const [balance, setBalance] = useState(5000); // Mock balance in NPR
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'TICKET',
      description: 'Kathmandu Music Festival Ticket',
      amount: -1500,
      date: '2024-03-15',
      status: 'COMPLETED',
    },
    {
      id: 2,
      type: 'DEPOSIT',
      description: 'Added funds via eSewa',
      amount: 5000,
      date: '2024-03-10',
      status: 'COMPLETED',
    },
  ]);

  const handleAddFunds = () => {
    if (amount && Number(amount) > 0) {
      setBalance(prev => prev + Number(amount));
      setTransactions(prev => [{
        id: Date.now(),
        type: 'DEPOSIT',
        description: 'Added funds via eSewa',
        amount: Number(amount),
        date: new Date().toISOString().split('T')[0],
        status: 'COMPLETED',
      }, ...prev]);
      setAmount('');
      setShowAddFunds(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#4caf50';
      case 'PENDING':
        return '#ff9800';
      case 'FAILED':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Balance Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountBalanceWallet sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Current Balance
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'white' }}>
                    ₨ {balance.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Add />}
                    onClick={() => setShowAddFunds(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    }}
                  >
                    Add Funds
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Receipt />}
                    sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                  >
                    View History
                  </Button>
                </Grid>
              </Grid>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Transaction History */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <GlassCard>
              <Typography variant="h5" gutterBottom sx={{ color: 'white', mb: 3 }}>
                Transaction History
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Date</StyledTableCell>
                      <StyledTableCell>Description</StyledTableCell>
                      <StyledTableCell>Type</StyledTableCell>
                      <StyledTableCell align="right">Amount</StyledTableCell>
                      <StyledTableCell align="right">Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <StyledTableCell>{transaction.date}</StyledTableCell>
                        <StyledTableCell>{transaction.description}</StyledTableCell>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {transaction.type === 'DEPOSIT' ? (
                              <ArrowUpward sx={{ color: '#4caf50', mr: 1, fontSize: 16 }} />
                            ) : (
                              <ArrowDownward sx={{ color: '#f44336', mr: 1, fontSize: 16 }} />
                            )}
                            {transaction.type}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell align="right" sx={{
                          color: transaction.amount > 0 ? '#4caf50' : '#f44336',
                          fontWeight: 500,
                        }}>
                          ₨ {Math.abs(transaction.amount).toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Chip
                            label={transaction.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(transaction.status),
                              color: 'white',
                            }}
                          />
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </GlassCard>
          </motion.div>
        </Grid>
      </Grid>

      {/* Add Funds Dialog */}
      <Dialog
        open={showAddFunds}
        onClose={() => setShowAddFunds(false)}
        PaperProps={{
          sx: {
            background: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle>Add Funds to Wallet</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Amount (NPR)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₨</Typography>,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'rgba(255, 255, 255, 0.5)' }}>
              Choose a payment method:
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  eSewa
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  Khalti
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddFunds(false)}>Cancel</Button>
          <Button
            onClick={handleAddFunds}
            variant="contained"
            disabled={!amount || Number(amount) <= 0}
          >
            Add Funds
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletDashboard; 