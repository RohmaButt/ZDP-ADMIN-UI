import { ThemeProvider, createTheme } from "@mui/material/styles";
import { addDecorator } from "@storybook/react";
import { withThemes } from "@react-theming/storybook-addon";
import theme from "../src/mui.theme";

const providerFn = ({ theme, children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

// pass ThemeProvider and array of your themes to decorator
addDecorator(withThemes(null, [theme], { providerFn }));

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
