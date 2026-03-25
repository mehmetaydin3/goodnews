import figma from '@figma/code-connect';
import { Input } from './Input';

// TODO: Replace FIGMA_URL with the URL of your Input component in Figma.
figma.connect(Input, 'FIGMA_URL', {
  props: {
    label: figma.string('Label'),
    placeholder: figma.string('Placeholder'),
    helperText: figma.string('Helper Text'),
    errorText: figma.string('Error Text'),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
    }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, placeholder, helperText, errorText, size, disabled }) => (
    <Input
      label={label}
      placeholder={placeholder}
      helperText={helperText}
      errorText={errorText}
      size={size}
      disabled={disabled}
    />
  ),
});
