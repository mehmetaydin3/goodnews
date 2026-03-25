import { Input } from './Input';

export default {
  title: 'Design System/Input',
  component: Input,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '360px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Default = {
  args: {
    label: 'Search musicians',
    placeholder: 'e.g. Hip-hop producer, mixing engineer...',
  },
};

export const WithHelperText = {
  args: {
    label: 'Your stage name',
    placeholder: 'DJ Khalid, Metro Boomin...',
    helperText: 'This will be shown on your public profile.',
  },
};

export const WithError = {
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    value: 'not-an-email',
    errorText: 'Please enter a valid email address.',
  },
};

export const WithLeftIcon = {
  args: {
    label: 'Search',
    placeholder: 'Find musicians, genres, or locations...',
    leftIcon: '🔍',
  },
};

export const WithRightIcon = {
  args: {
    label: 'Hourly rate',
    placeholder: '0',
    leftIcon: '$',
    rightIcon: '/hr',
    helperText: 'Set your minimum booking rate.',
  },
};

export const Disabled = {
  args: {
    label: 'Username',
    value: 'marcus_beats',
    disabled: true,
    helperText: 'Contact support to change your username.',
  },
};

export const Small = {
  args: {
    size: 'sm',
    label: 'Genre filter',
    placeholder: 'Hip-Hop, R&B, Pop...',
  },
};

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '360px' }}>
      <Input label="Default" placeholder="Search musicians..." />
      <Input
        label="With helper"
        placeholder="your@email.com"
        helperText="We'll never share your email."
      />
      <Input
        label="With error"
        placeholder="your@email.com"
        value="bad-email"
        errorText="Please enter a valid email address."
      />
      <Input
        label="Disabled"
        value="marcus_beats"
        disabled
        helperText="Contact support to change your username."
      />
      <Input label="With icon" placeholder="Search..." leftIcon="🔍" />
    </div>
  ),
};
