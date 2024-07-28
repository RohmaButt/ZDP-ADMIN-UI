import React from 'react';
import MenuComponent from './Menu';
import { MenuItem } from '@mui/material';
import { useState } from 'react';
import viewSummaryIcon from '../../assets/icon/view-summary.svg';
import EditIcon from '@mui/icons-material/Edit';
import IosShareIcon from '@mui/icons-material/IosShare';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import MenuItems from './MenuItems';

type IProps = {
  item: any;
  onClickDetail: (cardData: any) => void;
  SharedWith : boolean
  featureFlagActionEditConnection: boolean;
  onClickEdit: (cardData: any) => void;
  featureFlagActionShareConnection: boolean;
  setOpenShare: (value: React.SetStateAction<boolean>) => void;
  featureFlagActionDuplicateConnection: boolean;
  featureFlagActionDeleteConnection: boolean;
  onClickDuplicate: (cardData: any) => void;
  onClickDelete: (cardData: any) => void;
  onClickShare: (cardData: any) => void;
  onCloneShare: (cardData: any) => void;
};

const EditMenu = ({
  item,
  SharedWith,
  onClickDetail,
  featureFlagActionEditConnection,
  onClickEdit,
  featureFlagActionShareConnection,
  setOpenShare,
  featureFlagActionDuplicateConnection,
  featureFlagActionDeleteConnection,
  onClickDuplicate,
  onClickDelete,
  onClickShare,
  onCloneShare
}: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const HandleMenu = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  return (
    <>
      <MenuItems
        handleClone={() => {
          handleClose();
          onCloneShare(item);
        }}
        SharedWith = {SharedWith}
        anchorEl={anchorEl}
        handleClick={HandleMenu}
        handleClose={handleClose}
        onClickDetail={() => {
          handleClose();
          onClickDetail(item);
        }}
        onClickEdit={() => {
          handleClose();
          onClickEdit(item);
        }}
        handleOpenDeleteDialog={() => {
          handleClose();
          onClickDelete(item);
        }}
        handleUserDialogOpen={() => {
          handleClose();
          onClickShare(item);
        }}
        

        isDeleteDisabled={false}
        isEditDisabled={false}
        isShareDisabled={false}
        open={open}
        noIcon
      />

      {/* <MenuComponent
      handleClose={handleClose}
      anchorEl={anchorEl}
      handleClick={HandleMenu}
      borderRadius="24px"
      iconSize="32px"
    >
      <MenuItem
        sx={{ display: 'flex', gap: '8px' }}
        onClick={() => onClickDetail(item)}
        disableRipple
      >
        <img src={viewSummaryIcon} height={18} width={18} color="#005596"></img>
        View Summary
      </MenuItem>
      {featureFlagActionEditConnection && (
        <MenuItem
          onClick={() => onClickEdit(item)}
          disableRipple
          sx={{ display: 'flex', gap: '8px' }}
        >
          <EditIcon
            sx={{
              color: '#005596 !important',
              width: '18px',
              height: '18px',
            }}
          ></EditIcon>
          Edit
        </MenuItem>
      )}
      {featureFlagActionShareConnection && (
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            onClickShare(item);
          }}
          disableRipple
          sx={{ display: 'flex', gap: '8px' }}
        >
          <IosShareIcon
            sx={{
              color: '#005596 !important',
              width: '18px',
              height: '18px',
            }}
          ></IosShareIcon>
          Share
        </MenuItem>
      )}
      {featureFlagActionDuplicateConnection && (
        <MenuItem
          onClick={() => onClickDuplicate(item)}
          disableRipple
          sx={{ display: 'flex', gap: '8px' }}
        >
          <ContentCopyOutlinedIcon
            sx={{
              color: '#005596 !important',
              width: '18px',
              height: '18px',
            }}
          ></ContentCopyOutlinedIcon>
          Duplicate
        </MenuItem>
      )}
      {featureFlagActionDeleteConnection && (
        <MenuItem
          onClick={() => onClickDelete(item)}
          disableRipple
          sx={{ display: 'flex', gap: '8px' }}
        >
          <DeleteOutlineIcon
            sx={{
              color: '#005596 !important',
              width: '18px',
              height: '18px',
            }}
          ></DeleteOutlineIcon>
          Delete
        </MenuItem>
      )}
    </MenuComponent> */}
    </>
  );
};

export default EditMenu;
