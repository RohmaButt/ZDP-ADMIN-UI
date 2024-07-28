import * as React from "react";
import Box from "@mui/material/Box";
import { styled, Theme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import {
  GridColumnMenu,
  GridColumnMenuContainer,
  GridColumnMenuProps,
  GridFilterMenuItem,
  SortGridMenuItems,
} from "@mui/x-data-grid";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

type PaletteColorKey = "primary" | "secondary";
type OwnerState = {
  color: PaletteColorKey;
};

const StyledGridColumnMenuContainer = styled(GridColumnMenuContainer)<{
  ownerState: OwnerState;
}>(
  ({
    theme,
    ownerState = { color: "primary" },
  }: {
    theme: Theme;
    ownerState: OwnerState;
  }) => ({
    color: theme.palette.primary.main,
    background: theme.palette.primary.contrastText,
  })
);

const StyledGridColumnMenu = styled(GridColumnMenu)<{
  ownerState: OwnerState;
}>(
  ({
    theme,
    ownerState = { color: "primary" },
  }: {
    theme: Theme;
    ownerState: OwnerState;
  }) => ({
    color: theme.palette.primary.main,
    background: theme.palette.primary.contrastText,
  })
);

export default function CustomColumnMenuComponent(
  props: GridColumnMenuProps & OwnerState
) {
  const { hideMenu, currentColumn, color, ...other } = props;

  if (currentColumn.field === "name") {
    return (
      <StyledGridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        ownerState={{ color }}
        {...other}
      >
        <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
      </StyledGridColumnMenuContainer>
    );
  }
  if (currentColumn.field === "stars") {
    return (
      <StyledGridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        ownerState={{ color }}
        {...other}
      >
        <Box
          sx={{
            width: 127,
            height: 160,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StarOutlineIcon sx={{ fontSize: 80 }} />
        </Box>
      </StyledGridColumnMenuContainer>
    );
  }
  return (
    <StyledGridColumnMenu
      hideMenu={hideMenu}
      currentColumn={currentColumn}
      ownerState={{ color }}
      {...other}
    />
  );
}
