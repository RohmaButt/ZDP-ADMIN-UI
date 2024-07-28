// MuiChip.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import MuiChip from "./index";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Material Component/MuiChip",
  component: MuiChip,
} as ComponentMeta<typeof MuiChip>;

export const Primary: ComponentStory<typeof MuiChip> = () => <MuiChip />;
