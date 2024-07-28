import React, { ReactNode } from 'react';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import BoxComponent from '../Box';

type IProps = {
  toolTipTitle?: string;
  [key: string]: any;
  children: ReactNode;
  anchorEl?: null | HTMLElement;
  handleClose: () => void;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  borderRadius?: string;
  icon?: string;
  mainBoxStyle?: object;
  iconSize?: string;
};

export default function MenuComponent({
  toolTipTitle,
  children,
  anchorEl,
  handleClose,
  handleClick,
  borderRadius,
  mainBoxStyle,
  icon,
  iconSize,
  ...otherProps
}: IProps) {
  const open = Boolean(anchorEl);
  return (
    <React.Fragment>
      <BoxComponent
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          ...mainBoxStyle,
        }}
      >
        <Tooltip title={toolTipTitle}>
          <BoxComponent
            sx={{
              height: iconSize ? iconSize : '44px',
              width: iconSize ? iconSize : '44px',
              borderRadius: borderRadius ? borderRadius : '30px',
              background: '#FFFFFF',
              border: '1px solid #E2E5E9',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onClick={handleClick}
          >
            <IconButton
              size="small"
              sx={{ p: '0px', position: 'absolute' }}
              aria-controls={open ? 'menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {icon ? <img src={icon} alt={'iconAlt'} /> : <MoreVertIcon />}
            </IconButton>
          </BoxComponent>
        </Tooltip>
      </BoxComponent>
      <Menu
        anchorEl={anchorEl}
        id="menus"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            boxShadow: '0px 8px 20px -3px #13264029',
            mt: 1.5,
            borderRadius: '16px',
            p: '8px',

            // "& .MuiAvatar-root": {
            //   width: 42,
            //   height: 42,
            //   ml: -0.5,
            //   mr: 1,
            // },
            // "&:before": {
            //   content: '""',
            //   display: "block",
            //   position: "absolute",
            //   top: 0,
            //   right: 14,
            //   width: 10,
            //   height: 10,
            //   bgcolor: "background.paper",
            //   transform: "translateY(-50%) rotate(45deg)",
            //   zIndex: 0,
            // },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          boxShadow: '0px 8px 20px -3px #13264029',
          // '& .MuiList-padding': {
          //   p: '8px 12px',
          // },
        }}
        {...otherProps}
      >
        {children}
      </Menu>
    </React.Fragment>
  );
}

MenuComponent.defaultProps = {
  children: <></>,
  Tooltip: '',
};

{
  /* <MenuItem onClick={handleClose}>
          <Avatar /> Setting
        </MenuItem> */
}
