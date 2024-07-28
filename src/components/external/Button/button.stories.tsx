import React from "react";
import { Meta, Story } from "@storybook/react";
import Button, { ButtonProps } from "./index";

const meta: Meta = {
  title: "Material Component/Button",
  component: Button,
};

export default meta;

const Template: Story<ButtonProps> = (args) => (
  <Button {...args}>Click Here</Button>
);

//Default Story
export const Default = Template.bind({});
Default.args = {
  onClick: () => {},
};
