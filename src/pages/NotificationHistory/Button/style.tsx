export const btnStyles = {
  whiteButton: {
    height: '100%',
    width: '100%',
    borderRadius: '30px',
    padding: '10px 20px 10px 20px',
    color: '#132640',
    background: '#FFFFFF',
    border: '1px solid #C5C7D4',
    '&:hover': {
      backgroundColor: '#FFFFF',
    },
  },
  blackButton: {
    height: '100%',
    width: '100%',
    borderRadius: '30px',
    padding: '10px 20px 10px 20px',
    color: '#FFFFFF',
    background: '#132640',
    '&:hover': {
      backgroundColor: '#132640',
    },
  },
  blackDisabledButton: {
    height: '100%',
    width: '100%',
    borderRadius: '30px',
    padding: '10px 20px 10px 20px',
    background: '#C5C7D4',
    '&:hover': {
      backgroundColor: '#132640',
    },
    '& .MuiTypography-root': {
      color: '#FFFFFF',
    },
  },
};
