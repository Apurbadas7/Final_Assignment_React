import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { useMediaQuery } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IoMdDownload } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import exportFromJSON from 'export-from-json';
import { submitTransactionQuery } from '../../../api/transactionApi';

// Static Data as requested
const staticTransactions = [
  {
    id: 1,
    transactionId: 'e1b181ff4a4563898',
    amount: 10000,
    date: '24/02/2026, 12:23 PM',
    status: 'Received'
  },
  {
    id: 2,
    transactionId: 'a9c231ff4a4561234',
    amount: 5000,
    date: '24/02/2026, 01:10 PM',
    status: 'Pending'
  },
  {
    id: 3,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 4,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 5,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 6,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 7,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 8,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 9,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 10,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 11,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  },
  {
    id: 12,
    transactionId: 'z7x981ff4a4569999',
    amount: 7500,
    date: '24/02/2026, 02:45 PM',
    status: 'Failed'
  }
];

const TransactionReport = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { selectedVpa } = useSelector((state) => state.auth);
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [goToInput, setGoToInput] = useState('1');
  const [monthRange, setMonthRange] = useState('last-month');
  
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

  const handleGetTransactionsReports = async (filterType) => {
    const vpaId = selectedVpa?.vpa_id;
    if (!vpaId) {
      toast.warning('Please select a VPA first.');
      return;
    }

    setIsLoading(true);
    setPage(1);

    try {
      let dates = { start: '', end: '' };
      const todayStr = formatDate(dayjs());

      if (filterType === 'today') {
        dates = { start: todayStr, end: todayStr };
      } else if (filterType === 'monthly') {
        const rangeMap = { 'last-month': 30, 'last-3-months': 90, 'last-6-months': 180 };
        const days = rangeMap[monthRange] || 30;
        dates = { 
          start: formatDate(dayjs().subtract(days, 'day')), 
          end: todayStr 
        };
      } else {
        dates = { 
          start: formatDate(formik.values.startDate), 
          end: formatDate(formik.values.endDate) 
        };
      }

      // Still use the query submit API as requested
      await submitTransactionQuery({
        startDate: dates.start,
        endDate: dates.end,
        vpa_id: vpaId
      });

      toast.success('Query submitted successfully');
      // No polling here as per request
    } catch (err) {
      toast.error(err.message || 'Failed to submit report query.');
    } finally {
      setIsLoading(false);
    }
  };

  const initialValues = {
    filter: 'today',
    startDate: dayjs(),
    endDate: dayjs()
  };

  const validationSchema = Yup.object({
    startDate: Yup.date().when('filter', {
      is: 'custom',
      then: (schema) => schema.required('Start date is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    endDate: Yup.date().when('filter', {
      is: 'custom',
      then: (schema) => schema.required('End date is required').min(Yup.ref('startDate'), 'End date cannot be before start date'),
      otherwise: (schema) => schema.notRequired()
    }),
    filter: Yup.string().required().oneOf(['today', 'monthly', 'custom'])
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleGetTransactionsReports(values.filter);
    }
  });

  const handleDownload = () => {
    const fileName = `transaction_reports_${Date.now()}`;
    exportFromJSON({ data: staticTransactions, fileName, exportType: 'csv' });
  };

  const filteredData = useMemo(() => {
    return staticTransactions.filter((row) => {
      const txnId = String(row.transactionId || '').toLowerCase();
      const amount = String(row.amount || '');
      return txnId.includes(search.toLowerCase()) || amount.includes(search);
    });
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (_event, value) => {
    setPage(value);
  };

  const handleGoToPage = () => {
    const p = Number(goToInput);
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  useEffect(() => {
     setGoToInput(String(page));
  }, [page]);

  useEffect(() => {
    if (formik.values.filter === 'today') {
      handleGetTransactionsReports('today');
    }
  }, [formik.values.filter]);

  const getStatusStyles = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('success') || s.includes('received')) return { bg: '#E6F4EA', color: '#2E7D32' };
    if (s.includes('pending')) return { bg: '#FFF4E5', color: '#ED6C02' };
    if (s.includes('failed') || s.includes('decline')) return { bg: '#FDECEA', color: '#D32F2F' };
    return { bg: '#f1f5f9', color: '#64748b' };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 1 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
          
        </Typography>

        {/* FILTER SECTION */}
        <Card elevation={0} sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '12px', mb: 3 }}>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#4a5568', mb: 1.5 }}>
            Select a Report Filter
          </Typography>

          <RadioGroup name="filter" value={formik.values.filter} onChange={formik.handleChange} row>
            <FormControlLabel 
              value="today" 
              control={<Radio sx={{ color: '#00836e', '&.Mui-checked': { color: '#00836e' } }} />} 
              label="Today" 
            />
            <FormControlLabel 
              value="monthly" 
              control={<Radio sx={{ color: '#00836e', '&.Mui-checked': { color: '#00836e' } }} />} 
              label="Monthly" 
            />
            <FormControlLabel 
              value="custom" 
              control={<Radio sx={{ color: '#00836e', '&.Mui-checked': { color: '#00836e' } }} />} 
              label="Custom Range" 
            />
          </RadioGroup>

          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f1f5f9' }}>
            {formik.values.filter === 'today' && (
              <Typography variant="body2" color="text.secondary">
                Showing transactions for today: <b>{dayjs().format('DD MMM, YYYY')}</b>
              </Typography>
            )}

            {formik.values.filter === 'monthly' && (
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="flex-end">
                <Stack spacing={1} sx={{ minWidth: 250 }}>
                  <Typography variant="body2" fontWeight={600} color="#4b5563">Monthly Range</Typography>
                  <TextField 
                    size="small" 
                    select 
                    value={monthRange} 
                    fullWidth 
                    onChange={(e) => setMonthRange(e.target.value)}
                  >
                    <MenuItem value="last-month">Last Month Report</MenuItem>
                    <MenuItem value="last-3-months">Last 3 Months Report</MenuItem>
                    <MenuItem value="last-6-months">Last 6 Months Report</MenuItem>
                  </TextField>
                </Stack>
                <Button 
                  variant="contained" 
                  disabled={isLoading}
                  onClick={formik.handleSubmit}
                  sx={{ bgcolor: '#00836e', textTransform: 'none', px: 4, height: 40, '&:hover': { bgcolor: '#006d5b' } }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                </Button>
              </Stack>
            )}

            {formik.values.filter === 'custom' && (
              <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="flex-end">
                <Stack spacing={1}>
                  <Typography variant="body2" fontWeight={600} color="#4b5563">Start Date</Typography>
                  <DatePicker
                    value={formik.values.startDate}
                    onChange={(date) => formik.setFieldValue('startDate', date)}
                    disableFuture
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                        helperText: formik.touched.startDate && formik.errors.startDate
                      }
                    }}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="body2" fontWeight={600} color="#4b5563">End Date</Typography>
                  <DatePicker
                    value={formik.values.endDate}
                    onChange={(date) => formik.setFieldValue('endDate', date)}
                    disableFuture
                    slotProps={{
                      textField: {
                        size: 'small',
                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                        helperText: formik.touched.endDate && formik.errors.endDate
                      }
                    }}
                  />
                </Stack>

                <Button 
                  variant="contained" 
                  disabled={isLoading}
                  onClick={formik.handleSubmit}
                  sx={{ bgcolor: '#00836e', textTransform: 'none', px: 4, height: 40, '&:hover': { bgcolor: '#006d5b' } }}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Submit'}
                </Button>
              </Stack>
            )}
          </Box>
        </Card>

        {/* TABLE SECTION */}
        <Paper sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }} elevation={0}>
          <Stack padding={2} direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <TextField 
              size="small" 
              placeholder="Search by ID or Amount..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              sx={{ width: 280, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoIosSearch size={18} />
                    </InputAdornment>
                  )
                }
              }}
            />

            <Button 
              variant="contained" 
              startIcon={<IoMdDownload size={18} />} 
              onClick={handleDownload}
              sx={{ bgcolor: '#00836e', textTransform: 'none', px: 3, whiteSpace: 'nowrap', '&:hover': { bgcolor: '#006d5b' } }}
            >
              Download All
            </Button>
          </Stack>

          <TableContainer sx={{ position: 'relative' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Date & Time</TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => {
                  const style = getStatusStyles(row.status);
                  return (
                    <TableRow key={`${row.transactionId}-${index}`} hover>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{row.transactionId}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', fontWeight: 600 }}>₹ {row.amount}</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', color: '#64748b' }}>{row.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            backgroundColor: style.bg,
                            color: style.color,
                            fontWeight: 700,
                            borderRadius: '6px',
                            minWidth: '80px'
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" color="text.secondary">No records found for the search criteria.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}
          <Stack padding={2} direction={isMobile ? 'column' : 'row'} spacing={2} alignItems="center" justifyContent="space-between" sx={{ borderTop: '1px solid #f1f5f9' }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">Rows per page:</Typography>
                <TextField
                  select
                  size="small"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  sx={{ width: 70 }}
                >
                  {[5, 10, 20, 50].map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">Go to:</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={goToInput}
                  onChange={(e) => setGoToInput(e.target.value)}
                  onBlur={handleGoToPage}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleGoToPage(); }}
                  sx={{ width: 60 }}
                />
              </Stack>
            </Stack>

            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
              size="small"
            />
          </Stack>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default TransactionReport;
