export const successToastConfig = {
  position: 'top-right' as const,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    fontWeight: '500',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    border: 'none',
    fontSize: '14px',
    padding: '16px 20px',
  },
};

export const errorToastConfig = {
  position: 'top-right' as const,
  autoClose: 6000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    fontWeight: '500',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    border: 'none',
    fontSize: '14px',
    padding: '16px 20px',
  },
};

export const toastContainerConfig = {
  position: 'top-right' as const,
  autoClose: 5000,
  newestOnTop: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'colored' as const,
  toastStyle: {
    borderRadius: '12px',
    fontWeight: '500',
  },
};
