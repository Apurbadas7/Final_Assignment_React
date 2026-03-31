import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Divider, Avatar, Stack, TextField, Grid, Chip, IconButton, InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowUp } from 'react-icons/fa6';
import { IoMdSend } from 'react-icons/io';
import { ArrowLeft } from 'lucide-react';
import CloseTicketDialog from '../../../components/Dashboard/dialog/CloseTicketDialog';

const TicketDetails = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // dummy data
  const ticket = {
    id: transactionId,
    reason: 'Transaction Issue',
    raisedDate: '01 Mar, 2024',
    transactionId: '21638763981273921',
    status: 'Open',
    description:
      'The user "ReviewUser101" is requesting a review of their ban, citing new evidence that was not considered during the initial investigation.'
  };

  const messages = [
    {
      name: 'Program Manager',
      time: '01 Mar, 2024 02:42 PM',
      message: 'Hello Support Team, I recently found out that my account has been banned and I believe this might be a mistake...'
    },
    {
      name: 'Support Team',
      time: '02 Mar, 2024 10:12 AM',
      message: 'Hi, we reviewed your account and found that it was banned due to violations of our guidelines...'
    }
  ];

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
    <Box p={1}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2} alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)} size="small">
                <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h6" fontWeight={600}>Help & Support</Typography>
        </Stack>
        <Button variant="contained" disabled sx={{ textTransform: 'none' }}>Raise a ticket</Button>
      </Stack>

      <Paper sx={{ py: 3, mb: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }} elevation={0}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} px={3} mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            Ticket ID: <span style={{ color: '#00836e' }}>#{ticket.id}</span>
          </Typography>

          <Button 
            variant="contained" 
            color="inherit" 
            onClick={() => setOpen(true)}
            sx={{ textTransform: 'none', px: 3, bgcolor: '#f1f5f9', fontWeight: 600 }}
          >
            Close Ticket
          </Button>
        </Stack>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4} px={3}>
          <Grid item xs={12} sm={4}>
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                      Reason Type
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{ticket.reason}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                      Raised Date
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{ticket.raisedDate}</Typography>
                </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                      Transaction ID
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{ticket.transactionId}</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                      Status
                    </Typography>
                    <Box mt={0.5}>
                    {(() => {
                      const style = getStatusStyle(ticket.status.toLowerCase());
                      return (
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            bgcolor: style.bg,
                            color: style.color,
                            fontWeight: 700,
                            px: 1,
                            borderRadius: '6px'
                          }}
                        />
                      );
                    })()}
                    </Box>
                </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: '#475569', lineHeight: 1.6 }}>{ticket.description}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Messages */}
      <Paper sx={{ py: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }} elevation={0}>
        <Typography variant="subtitle1" px={3} fontWeight={700}>
          Messages
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box textAlign="center" mb={4}>
          <Button 
            variant="contained" 
            size="small" 
            startIcon={<FaArrowUp size={12} />} 
            sx={{ borderRadius: 20, bgcolor: '#f1f5f9', color: '#64748b', textTransform: 'none', px: 2, boxShadow: 'none', '&:hover': { bgcolor: '#e2e8f0' } }}
          >
            Show Older Messages
          </Button>
        </Box>

        <Stack spacing={4} px={3} mb={4}>
            {messages.map((msg, index) => (
              <Box key={index}>
                <Stack direction="row" spacing={2}>
                  <Avatar sx={{ bgcolor: index === 0 ? '#00836e' : '#10b981', width: 36, height: 36, fontSize: '0.9rem' }}>
                    {msg.name[0]}
                  </Avatar>

                  <Box>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography fontWeight={700} sx={{ color: '#1e293b' }}>{msg.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {msg.time}
                        </Typography>
                    </Stack>
                    <Typography mt={1} variant="body2" sx={{ color: '#4b5563', lineHeight: 1.5 }}>{msg.message}</Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
        </Stack>

        {/* Reply Box */}
        <Box px={3}>
            <TextField
                fullWidth
                placeholder="Reply here..."
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '12px',
                    pl: 1,
                    background: '#f8fafc'
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Avatar sx={{ width: 28, height: 28, bgcolor: '#00836e' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton sx={{ color: '#00836e' }}>
                          <IoMdSend size={22} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
            />
        </Box>
      </Paper>

      <CloseTicketDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log('closing ticket...');
          setOpen(false);
        }}
        ticket={ticket}
      />
    </Box>
  );
};

export default TicketDetails;
