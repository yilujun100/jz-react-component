import React from 'react';
import type { StoryFn, Meta, StoryObj } from '@storybook/react';
import Button from './Button';

type Story = StoryObj<typeof Button>;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Button> = {
  title: 'ReactComponentLibrary/Button',
  component: Button
};
export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof Button> = args => <Button {...args} />;

export const HelloWorld: Story = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
HelloWorld.args = {
  label: 'Hello world!'
};

export const ClickMe: Story = Template.bind({});
ClickMe.args = {
  label: 'Click me!'
};
