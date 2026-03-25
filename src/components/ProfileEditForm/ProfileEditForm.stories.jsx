import { ProfileEditForm } from './ProfileEditForm';

export default {
  title: 'Profile / ProfileEditForm',
  component: ProfileEditForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Full profile creation and editing form for musicians. Requires a valid JWT token to load and save data. Pass `token` and optionally override `apiBase`.',
      },
    },
  },
};

// No token — unauthenticated state
export const Unauthenticated = {
  args: {
    token: '',
  },
};

// With a mock token (will fail to fetch but renders the empty form after error)
export const AuthenticatedEmpty = {
  args: {
    token: 'mock-jwt-token',
    apiBase: 'http://localhost:5001',
  },
};

// Pre-filled snapshot (uses static initial data via a wrapper)
export const Prefilled = {
  render: () => {
    // Render with no token to avoid fetch; profile fields are shown in the
    // empty/sign-in state — for a real prefilled story, pass a valid token.
    return (
      <div style={{ padding: '32px', maxWidth: '720px' }}>
        <ProfileEditForm
          token=""
          apiBase="http://localhost:5001"
        />
      </div>
    );
  },
};
