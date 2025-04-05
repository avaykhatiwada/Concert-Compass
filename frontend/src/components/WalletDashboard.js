import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Add,
  Send,
  QrCode,
  Receipt,
  ArrowUpward,
  ArrowDownward,
  History,
  DateRange,
  Share,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const WalletContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(3),
  color: '#fff',
}));

const TransactionItem = styled(ListItem)(({ theme, type }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  background: 'rgba(255, 255, 255, 0.05)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiListItemIcon-root': {
    color: type === 'CREDIT' ? '#4caf50' : '#f44336',
  },
}));

const WalletDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showTopUpDialog, setShowTopUpDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const paymentMethods = [
    { id: 'connectips', name: 'ConnectIPS', logo: '🏦' },
    { id: 'fonepay', name: 'FonePay', logo: '📱' },
    { id: 'prabhupay', name: 'PrabhuPay', logo: '💳' },
    { id: 'esewa', name: 'eSewa', logo: '💰' },
    { id: 'khalti', name: 'Khalti', logo: '💸' },
  ];

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      // API calls would go here
      setBalance(5000); // Mock data
      setTransactions([
        {
          id: 1,
          type: 'CREDIT',
          amount: 1000,
          description: 'Top up via eSewa',
          date: new Date(),
          reference: 'TXN123'
        },
        // More mock transactions...
      ]);
    } catch (error) {
      setError('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(prev => prev + parseFloat(topUpAmount));
      setShowTopUpDialog(false);
      setTopUpAmount('');
      setSelectedPaymentMethod(null);
    } catch (error) {
      setError('Top up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBalance(prev => prev - parseFloat(transferAmount));
      setShowTransferDialog(false);
      setTransferAmount('');
      setRecipientId('');
      setTransferDescription('');
    } catch (error) {
      setError('Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQrCode('data:image/png;base64,...'); // Mock QR code
      setShowQRDialog(true);
    } catch (error) {
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleExportStatement = async () => {
    if (!startDate || !endDate) {
      setError('Please select date range');
      return;
    }

    try {
      // API call would go here
      const statement = {
        // Mock statement data
      };
      
      // Create and download PDF
      console.log('Downloading statement...', statement);
    } catch (error) {
      setError('Failed to export statement');
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format('PPpp');
  };

  const renderTransactions = () => (
    <List>
      {transactions.map(tx => (
        <TransactionItem key={tx.id} type={tx.type}>
          <ListItemIcon>
            {tx.type === 'CREDIT' ? <ArrowUpward /> : <ArrowDownward />}
          </ListItemIcon>
          <ListItemText
            primary={tx.description}
            secondary={
              <>
                {formatDate(tx.date)}
                <br />
                Reference: {tx.reference}
              </>
            }
          />
          <Typography
            variant="h6"
            color={tx.type === 'CREDIT' ? 'success.main' : 'error.main'}
          >
            {tx.type === 'CREDIT' ? '+' : '-'} NPR {tx.amount}
          </Typography>
        </TransactionItem>
      ))}
    </List>
  );

  return (
    <WalletContainer maxWidth="lg">
      <Grid container spacing={3}>
        {/* Balance Card */}
        <Grid item xs={12}>
          <GlassCard>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Wallet Balance</Typography>
                <Typography variant="h3">NPR {balance.toFixed(2)}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowTopUpDialog(true)}
                sx={{
                  background: 'linear-gradient(45deg, #2196f3, #64b5f6)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  },
                }}
              >
                Top Up
              </Button>
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() => setShowTransferDialog(true)}
                sx={{
                  background: 'linear-gradient(45deg, #66bb6a, #81c784)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #43a047, #66bb6a)',
                  },
                }}
              >
                Transfer
              </Button>
              <Button
                variant="contained"
                startIcon={<QrCode />}
                onClick={handleGenerateQR}
                sx={{
                  background: 'linear-gradient(45deg, #7e57c2, #9575cd)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5e35b1, #7e57c2)',
                  },
                }}
              >
                Show QR
              </Button>
            </Box>
          </GlassCard>
        </Grid>

        {/* Transactions */}
        <Grid item xs={12}>
          <GlassCard>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 3 }}
            >
              <Tab icon={<History />} label="Recent" />
              <Tab icon={<DateRange />} label="Statement" />
            </Tabs>

            {activeTab === 0 ? (
              renderTransactions()
            ) : (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Receipt />}
                      onClick={handleExportStatement}
                      sx={{ height: '100%' }}
                    >
                      Export
                    </Button>
                  </Grid>
                </Grid>
                {renderTransactions()}
              </Box>
            )}
          </GlassCard>
        </Grid>
      </Grid>

      {/* Top Up Dialog */}
      <Dialog
        open={showTopUpDialog}
        onClose={() => setShowTopUpDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Top Up Wallet
          </Typography>
          <TextField
            fullWidth
            label="Amount (NPR)"
            type="number"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {paymentMethods.map(method => (
              <Grid item xs={6} key={method.id}>
                <Button
                  fullWidth
                  variant={selectedPaymentMethod === method.id ? 'contained' : 'outlined'}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  sx={{ height: '80px' }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">{method.logo}</Typography>
                    <Typography variant="caption">{method.name}</Typography>
                  </Box>
                </Button>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setShowTopUpDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleTopUp}
              disabled={!topUpAmount || !selectedPaymentMethod || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Proceed'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog
        open={showTransferDialog}
        onClose={() => setShowTransferDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Transfer Funds
          </Typography>
          <TextField
            fullWidth
            label="Recipient ID"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Amount (NPR)"
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={transferDescription}
            onChange={(e) => setTransferDescription(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setShowTransferDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleTransfer}
              disabled={!recipientId || !transferAmount || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Transfer'}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Wallet QR Code
          </Typography>
          {qrCode && (
            <Box sx={{ mb: 2 }}>
              <img src={qrCode} alt="Wallet QR" style={{ width: '100%' }} />
            </Box>
          )}
          <Typography variant="caption" color="text.secondary">
            Scan this QR code to receive payments
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Share />}
              onClick={() => {/* Share functionality */}}
            >
              Share QR Code
            </Button>
          </Box>
        </Box>
      </Dialog>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 9999
          }}
        >
          {error}
        </Alert>
      )}
    </WalletContainer>
  );
};

export default WalletDashboard; 