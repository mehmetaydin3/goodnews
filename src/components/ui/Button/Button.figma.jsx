import figma from '@figma/code-connect';
import { Button } from './Button';

// TODO: Replace FIGMA_URL with the URL of your Button component in Figma.
// After importing via html.to.design → right-click the frame → "Create component"
// → right-click the component → "Copy link to selection"
figma.connect(Button, 'FIGMA_URL', {
  props: {
    variant: figma.enum('Variant', {
      primary: 'primary',
      secondary: 'secondary',
      ghost: 'ghost',
      danger: 'danger',
    }),
    size: figma.enum('Size', {
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    loading: figma.boolean('Loading'),
    disabled: figma.boolean('Disabled'),
    fullWidth: figma.boolean('Full Width'),
    children: figma.string('Label'),
  },
  example: ({ variant, size, loading, disabled, fullWidth, children }) => (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  ),
});
