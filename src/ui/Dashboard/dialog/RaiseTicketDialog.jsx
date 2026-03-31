import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  IconButton
} from '@mui/material';
import { X } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  reasonType: Yup.string().required('Reason Type is required'),
  transactionId: Yup.string().required('Transaction ID is required'),
  vpa: Yup.string().required('VPA is required'),
  description: Yup.string().max(250, 'Max 250 characters').required('Description is required')
});

const RaiseTicketDialog = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      reasonType: 'Transaction Related',
      transactionId: '',
      vpa: '',
      description: ''
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Raising ticket:', values);
      toast.success('Ticket raised successfully');
      formik.resetForm();
      onClose();
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f8fafc' }}>
        <Typography variant="h6" fontWeight={600}>Raise Ticket</Typography>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Stack spacing={1}>
              <Typography variant="body2" fontWeight={600} color="#4b5563">Reason Type</Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="reasonType"
                value={formik.values.reasonType}
                onChange={formik.handleChange}
                error={formik.touched.reasonType && Boolean(formik.errors.reasonType)}
                helperText={formik.touched.reasonType && formik.errors.reasonType}
              >
                <MenuItem value="Transaction Related">Transaction Related</MenuItem>
                <MenuItem value="Technical Issue">Technical Issue</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" fontWeight={600} color="#4b5563">Transaction ID</Typography>
              <TextField
                fullWidth
                size="small"
                name="transactionId"
                placeholder="e.g. 21638763981273921"
                value={formik.values.transactionId}
                onChange={formik.handleChange}
                error={formik.touched.transactionId && Boolean(formik.errors.transactionId)}
                helperText={formik.touched.transactionId && formik.errors.transactionId}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography variant="body2" fontWeight={600} color="#4b5563">Select VPA</Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="vpa"
                value={formik.values.vpa}
                onChange={formik.handleChange}
                error={formik.touched.vpa && Boolean(formik.errors.vpa)}
                helperText={formik.touched.vpa && formik.errors.vpa}
              >
                <MenuItem value="merchant@idbi">merchant@idbi</MenuItem>
              </TextField>
            </Stack>

            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" fontWeight={600} color="#4b5563">Description</Typography>
                <Typography variant="caption" color="text.secondary">Max 250 characters</Typography>
              </Stack>
              <TextField
                fullWidth
                multiline
                rows={3}
                name="description"
                placeholder="Describe the issue..."
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', gap: 1 }}>
          <Button onClick={onClose} sx={{ color: '#ef4444', textTransform: 'none', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#00836e', px: 4, textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#006d5b' } }}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RaiseTicketDialog;
