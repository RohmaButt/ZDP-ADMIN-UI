import React, { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import BoxComponent from '../Box';
import TypographyComponent from '../Typography';
import DividerComponent from '../Divider';
import ButtonComponent from '../Button';
import { styles } from './style';
import CircularParogress from '../CircularProgress';
import { ButtonTypes } from '../../../utils/constants';
import crossicon from '../../../assets/icon/cross_icon.png';
import { Box } from '@mui/material';

type IProps = {
  open: boolean;
  handleClose?: any;
  title?: String;
  subTitle?: String;
  handleSave?: (event: React.MouseEvent<HTMLElement>) => void;
  children?: ReactNode;
  dialogChildrenStyle?: object;
  firstDivider?: boolean;
  duplicate?: () => void;
  handleNext?: () => void;
  handleDelete?: () => void; //added handle delete func
  showNext?: boolean;
  maxHeight?: string;
  imgIcon?: string;
  saveButtonText?: string;
  isLoading?: boolean;
  isLoadingDelete?: boolean;
  [key: string]: any; // Allow any other additional props
};

function DialogComponent({
  open,
  handleClose,
  title,
  subTitle,
  children,
  handleSave,
  dialogChildrenStyle,
  firstDivider,
  duplicate,
  handleNext,
  handleDelete,
  showNext,
  maxHeight,
  imgIcon,
  saveButtonText,
  SaveButtonRef,
  isLoading,
  isLoadingDelete,
  ...otherProps
}: IProps) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <BoxComponent
        sx={{
          display: 'flex',
          p: '20px 0px 16px 0px',
          flexDirection: 'column',
        }}
      >
        <BoxComponent sx={styles.dialogHeader}>
          <Box sx={{ position: 'relative' }}>
            {/* <BoxComponent sx={styles.headerChildDiv}>
              {imgIcon && (
                <img
                  width={'40px'}
                  height={'40px'}
                  src={imgIcon}
                  style={{ cursor: 'pointer' }}
                />
              )}

              <TypographyComponent
                sx={styles.dialogText}
                variant="DialogText"
                component="p"
              >
                {title}
              </TypographyComponent>
            </BoxComponent> */}
            <img
              width={'15.38px'}
              height={'15.38px'}
              src={crossicon}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: 0,
                right: 0,
                transform: 'translate(50%, -50%)',
              }}
              onClick={handleClose}
            />
          </Box>
          {subTitle && (
            <TypographyComponent
              sx={styles.dialogSubtitle}
              variant="DialogSubTitle"
              component="p"
            >
              {subTitle}
            </TypographyComponent>
          )}
        </BoxComponent>
        {firstDivider && <DividerComponent sx={{ width: '100%' }} />}
        <DialogContent
          sx={{
            ...dialogChildrenStyle,
            p: '10px 24px',
            maxHeight: maxHeight ? maxHeight : '450px',
          }}
        >
          {children}
        </DialogContent>
        <DividerComponent sx={{ width: '100%' }} />
        <DialogActions sx={styles.dialogAction}>
          <BoxComponent sx={styles.buttonBox}>
            <ButtonComponent
              sx={styles.cancelButton}
              types={ButtonTypes.White}
              onClick={handleClose}
            >
              Cancel
            </ButtonComponent>
            {duplicate && (
              <ButtonComponent sx={styles.duplicateButton} onClick={duplicate}>
                Duplicate
              </ButtonComponent>
            )}
            {!showNext && handleSave && (
              <ButtonComponent
                sx={styles.saveButton}
                onClick={handleSave}
                disabled={isLoading ? isLoading : false}
                isLoading={isLoading}
              >
                {saveButtonText}
              </ButtonComponent>
            )}
            {showNext && (
              <ButtonComponent sx={styles.saveButton} onClick={handleNext}>
                Next
              </ButtonComponent>
            )}
            {handleDelete && (
              <ButtonComponent
                sx={styles.saveButton}
                onClick={handleDelete}
                disabled={isLoadingDelete ? isLoadingDelete : false}
                isLoading={isLoadingDelete}
              >
                Delete
              </ButtonComponent>
            )}
          </BoxComponent>
        </DialogActions>
      </BoxComponent>
    </Dialog>
  );
}

export default DialogComponent;

DialogComponent.defaultProps = {
  open: false,
  children: <></>,
  handleClose: () => {},
  //handleSave: () => {},
  firstDivider: true,
  maxHeight: '450px',
  saveButtonText: 'Save',
};
