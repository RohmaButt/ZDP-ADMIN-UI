export const txtFieldStyles = {
  enableTxt: {
    backgroundColor: '#fff',
    maxHeight: '48px',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    '& .MuiFormLabel-root': {
      display: 'flex',
    },
    '& .MuiFormHelperText-root': {
      color: 'red',
    },
    '& .MuiFormLabel-asterisk': {
      color: 'red',
    },
  },
  disableTxt: {
    backgroundColor: '#F2F6F9',
    borderRadius: '8px',
    width: '100%',
    display: 'flex',
    '& .MuiFormLabel-root': {
      display: 'flex',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '0px 4px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
  },
  searchTxt: {
    p: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    height: '34px',
    boxShadow: '0px 0px',
    marginTop: '1%',
  },
};
