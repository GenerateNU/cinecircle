import { render, waitFor } from '@testing-library/react-native';

jest.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}));


jest.mock('./ProjectNavigator', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => (
      <View testID="project-navigator">
        <Text>ProjectNavigator</Text>
      </View>
    ),
  };
});

jest.mock('./LoginNavigator', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => (
      <View testID="login-navigator">
        <Text>LoginNavigator</Text>
      </View>
    ),
  };
});

import RootNavigator from './RootNavigator';
const { supabase } = require('../../lib/supabase');

describe('RootNavigator Routing', () => {
  const TEST_USER = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders LoginNavigator when not authenticated', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { getByTestId } = render(<RootNavigator />);
    await waitFor(() => {
      expect(getByTestId('login-navigator')).toBeTruthy();
    });
  });

  it('renders ProjectNavigator when authenticated', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: TEST_USER } },
    });
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { getByTestId } = render(<RootNavigator />);
    await waitFor(() => {
      expect(getByTestId('project-navigator')).toBeTruthy();
    });
  });
});
