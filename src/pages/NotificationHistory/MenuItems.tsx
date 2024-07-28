import React from 'react';
import { Box, Button, Menu, MenuItem, MenuProps, alpha } from '@mui/material';
import { styled } from '@mui/system';
import avatarsSvg from '../../assets/icon/avatars-icon.svg';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

type MenuItemsProps = {
  SharedWith: boolean;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleOpenDeleteDialog: () => void;
  open: boolean;
  handleClose: () => void;
  anchorEl: HTMLElement | null;
  onClickEdit: () => void;
  onClickDetail: () => void;
  handleClone: () => void;
  isEditDisabled: boolean;
  handleUserDialogOpen: () => void;
  isShareDisabled: boolean;
  isDeleteDisabled: boolean;
  noIcon?: boolean;
};

function MenuItems(props: MenuItemsProps) {
  const {
    handleClick,
    SharedWith,
    handleOpenDeleteDialog,
    open,
    handleClose,
    anchorEl,
    onClickEdit,
    onClickDetail,
    isEditDisabled,
    handleUserDialogOpen,
    handleClone,
    isShareDisabled,
    isDeleteDisabled,
    noIcon,
  } = props;
  const featureFlagActionDeleteConnection = useFeatureIsOn(
    'dataflow-action-delete-connection'
  );
  const featureFlagActionEditConnection = useFeatureIsOn(
    'dataflow-action-edit-connection'
  );
  const featureFlagActionDuplicateConnection = useFeatureIsOn(
    'dataflow-action-duplicate-connection'
  );
  const featureFlagActionShareConnection = useFeatureIsOn(
    'dataflow-action-share-connection'
  );

  return (
    <Box
      width={'100%'}
      justifyContent={'space-between'}
      display={'flex'}
      alignItems={'flex-start'}
    >
      <Box width={'100%'} justifyContent={'space-between'} display={'flex'}>
        {!noIcon && <img src={avatarsSvg} width={30} height={30}></img>}
        <Button sx={{ color: '#7A7E8B' }} onClick={handleClick}>
          <MoreHorizIcon />
        </Button>
      </Box>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {/* {featureFlagActionEditConnection && (
          <MenuItem
            onClick={onClickEdit}
            disabled={isEditDisabled}
            disableRipple
          >
            <EditIcon
              sx={{
                color: '#7A7E8B !important',
                width: '20px',
                height: '20px',
              }}
            ></EditIcon>
            Edit
          </MenuItem>
        )} */}

        {SharedWith ? (
          <MenuItem
            onClick={handleUserDialogOpen}
            disabled={isShareDisabled}
            disableRipple
          >
            <IosShareIcon
              sx={{
                color: '#7A7E8B !important',
                width: '20px',
                height: '20px',
              }}
            ></IosShareIcon>
            Share
          </MenuItem>
        ) : (
          <MenuItem
            onClick={handleClone}
            disabled={isShareDisabled}
            disableRipple
          >
            <IosShareIcon
              sx={{
                color: '#7A7E8B !important',
                width: '20px',
                height: '20px',
              }}
            ></IosShareIcon>
            Clone
          </MenuItem>
        )}

        {/* {featureFlagActionShareConnection && (
          <MenuItem
            onClick={handleUserDialogOpen}
            disabled={isShareDisabled}
            disableRipple
          >
            <IosShareIcon
              sx={{
                color: '#7A7E8B !important',
                width: '20px',
                height: '20px',
              }}
            ></IosShareIcon>
            Share
          </MenuItem>
        )} */}

        {/* {featureFlagActionDuplicateConnection && (
          <MenuItem onClick={onClickDetail} disableRipple>
            <img
              src={viewSummaryIcon}
              height={15}
              width={15}
              color="#005596"
              style={{ marginRight: '10px' }}
            ></img>
            View Summary
          </MenuItem>
        )} */}

        {/* {featureFlagActionDeleteConnection && (
          <MenuItem
            onClick={handleOpenDeleteDialog}
            disabled={isDeleteDisabled}
            disableRipple
            sx={{ color: '#C60000' }}
          >
            <DeleteIcon
              sx={{
                color: '#C60000 !important',
                width: '20px',
                height: '20px',
              }}
            ></DeleteIcon>
            Delete
          </MenuItem>
        )} */}
      </StyledMenu>
    </Box>
  );
}

export default MenuItems;
