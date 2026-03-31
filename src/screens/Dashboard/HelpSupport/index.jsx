import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Grid,
  InputAdornment,
  Chip,
  Pagination
} from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import NoData from '../../../assets/noData.svg';
import RaiseTicketDialog from '../../../components/Dashboard/dialog/RaiseTicketDialog';
import { useNavigate } from 'react-router-dom';

const tableData = [
  {
    id: 'TXN001',
    date: '15/01/2026, 11:23:32 AM',
    number: '+91 9349872421',
    operation: 'Transaction Declined',
    status: 'Pending'
  },
  {
    id: 'TXN002',
    date: '15/01/2026, 11:24:10 AM',
    number: '+91 9123456789',
    operation: 'Transaction Declined',
    status: 'Resolved'
  },
  {
    id: 'TXN003',
    date: '15/01/2026, 11:25:45 AM',
    number: '+91 9988776655',
    operation: 'Transaction Declined',
    status: 'Unresolved'
  },
  {
    id: 'TXN004',
    date: '15/01/2026, 11:26:12 AM',
    number: '+91 9876543210',
    operation: 'Transaction Declined',
    status: 'Pending'
  },
  {
    id: 'TXN005',
    date: '15/01/2026, 11:27:30 AM',
    number: '+91 9012345678',
    operation: 'Transaction Declined',
    status: 'Resolved'
  },
  {
    id: 'TXN006',
    date: '15/01/2026, 11:28:55 AM',
    number: '+91 9090909090',
    operation: 'Transaction Declined',
    status: 'Unresolved'
  },
  {
    id: 'TXN007',
    date: '15/01/2026, 11:30:02 AM',
    number: '+91 9345678901',
    operation: 'Transaction Declined',
    status: 'Pending'
  },
  {
    id: 'TXN008',
    date: '15/01/2026, 11:31:18 AM',
    number: '+91 9234567890',
    operation: 'Transaction Declined',
    status: 'Resolved'
  },
  {
    id: 'TXN009',
    date: '15/01/2026, 11:32:40 AM',
    number: '+91 9191919191',
    operation: 'Transaction Declined',
    status: 'Unresolved'
  },
  {
    id: 'TXN010',
    date: '15/01/2026, 11:33:55 AM',
    number: '+91 9000000001',
    operation: 'Transaction Declined',
    status: 'Pending'
  },
  {
    id: 'TXN011',
    date: '15/01/2026, 11:35:12 AM',
    number: '+91 9888888888',
    operation: 'Transaction Declined',
    status: 'Resolved'
  },
  {
    id: 'TXN012',
    date: '15/01/2026, 11:36:45 AM',
    number: '+91 9777777777',
    operation: 'Transaction Declined',
    status: 'Unresolved'
  }
];

const validationSchema = Yup.object({
  startDate: Yup.string().required('Start Date is required'),
  endDate: Yup.string().required('End Date is required'),
  status: Yup.string().required('Status is required')
});

export default function HelpSupport() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [goToInput, setGoToInput] = useState('1');

  const handleViewDetails = (id) => {
    navigate(`/dashboard/support/${id}`);
  };

  const formik = useFormik({
    initialValues: {
      startDate: '',
      endDate: '',
      status: ''
    },
    validationSchema,
    onSubmit: () => {}
  });

  const filteredData = useMemo(() => {
    return tableData.filter((item) => item.number.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const handleGoToPage = () => {
    const pageNumber = Number(goToInput);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return {
          bg: '#E5F9FF',
          color: '#00BED4'
        };

      case 'pending':
        return {
          bg: '#FFF4E5',
          color: '#FF8A00'
        };
      case 'closed':
        return {
          bg: '#e7e7e7ff',
          color: '#767676ff'
        };

      case 'resolved':
        return {
          bg: '#F6FFED',
          color: '#52C41A'
        };
      case 'unresolved':
        return {
          bg: '#FCE7EB',
          color: '#DE1135'
        };
      case 'open':
        return {
          bg: '#E5F3FF',
          color: '#0066FF'
        };

      default:
        return {
          bg: '#E5E7EB',
          color: '#6B7280'
        };
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{ bgcolor: '#00836e', textTransform: 'none', '&:hover': { bgcolor: '#006d5b' } }}>
          Raise a ticket
        </Button>
      </Stack>
      <Paper sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }} elevation={0}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2} alignItems={'flex-start'}>
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" mb={1} fontWeight={600} color="#4b5563">Start Date</Typography>
              <DatePicker
                placeholder="Start Date"
                value={formik.values.startDate || null}
                onChange={(value) => formik.setFieldValue('startDate', value)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    error: formik.touched.startDate && Boolean(formik.errors.startDate),
                    helperText: formik.touched.startDate && formik.errors.startDate,
                    onBlur: formik.handleBlur
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography variant="body2" mb={1} fontWeight={600} color="#4b5563">End Date</Typography>
              <DatePicker
                placeholder="End Date"
                value={formik.values.endDate || null}
                onChange={(value) => formik.setFieldValue('endDate', value)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    error: formik.touched.endDate && Boolean(formik.errors.endDate),
                    helperText: formik.touched.endDate && formik.errors.endDate,
                    onBlur: formik.handleBlur
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <Typography variant="body2" mb={1} fontWeight={600} color="#4b5563">Ticket Status</Typography>
              <TextField
                size="small"
                select
                fullWidth
                {...formik.getFieldProps('status')}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                sx={{
                  '& .MuiInputBase-root': {
                    height: 40
                  }
                }}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (selected) => (selected ? selected : <span style={{ color: '#aaa' }}>Select Ticket Status</span>)
                  }
                }}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Unresolved">Unresolved</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box mb={3.8} />
              <Button type="submit" variant="contained" sx={{ height: 40, bgcolor: '#00836e', textTransform: 'none', px: 4, '&:hover': { bgcolor: '#006d5b' } }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Paper sx={{ p: 2, mt: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }} elevation={0}>
        {tableData.length > 0 && (
          <Box mb={3} width={300}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter Number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoIosSearch size={18} />
                    </InputAdornment>
                  )
                }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />
          </Box>
        )}

        {filteredData.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Box component={'img'} src={NoData} alt="no data" width={180} />
            <Typography mt={2} color="text.secondary">No Data Found</Typography>
          </Box>
        ) : (
          <>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Raised On</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Operation</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.number}</TableCell>
                    <TableCell>{row.operation}</TableCell>
                    <TableCell>
                      {(() => {
                        const style = getStatusStyle(row.status.toLowerCase());

                        return (
                          <Chip
                            label={row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
                            size="small"
                            sx={{
                              bgcolor: style.bg,
                              color: style.color,
                              fontWeight: 600,
                              borderRadius: '6px'
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => handleViewDetails(row.id)} sx={{ textTransform: 'none', color: '#00836e', fontWeight: 600 }}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Stack p={2} direction={'row'} spacing={2} alignItems="center" justifyContent="space-between">
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
                    slotProps={{
                        input: {
                            sx: { fontSize: '0.875rem' }
                        }
                    }}
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGoToPage();
                    }}
                    sx={{ width: 70 }}
                    placeholder="Page"
                    slotProps={{
                        input: {
                            sx: { fontSize: '0.875rem' }
                        }
                    }}
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
          </>
        )}
      </Paper>
      <RaiseTicketDialog open={open} onClose={() => setOpen(false)} />
    </LocalizationProvider>
  );
}
