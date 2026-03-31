import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  IconButton
} from '@mui/material';
import { X, AlertCircle } from 'lucide-react';

const CloseTicketDialog = ({ open, onClose, onConfirm, ticket }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>Close Ticket</Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 4, textAlign: 'center' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1.5rem' }} />
        <Typography variant="h6" gutterBottom fontWeight={600}>Are you sure?</Typography>
        <Typography variant="body2" color="text.secondary">
          You are about to close ticket <b>#{ticket?.id}</b>. This action will mark the ticket as resolved/closed.
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>
          No, Go Back
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={onConfirm}
          sx={{ px: 4, textTransform: 'none', borderRadius: '6px' }}
        >
          Yes, Close Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseTicketDialog;
