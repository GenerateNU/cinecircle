import { Stack } from 'expo-router';
import { createContext, useContext, useState } from 'react';

type OnboardingData = {
  username?: string;
  profilePicture?: string | null;
  country?: string;
  city?: string;
  primaryLanguage?: string;
  secondaryLanguages?: string[];
  genres?: string[];
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  resetData: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within onboarding flow');
  }
  return context;
}

export default function OnboardingLayout() {
  const [data, setData] = useState<OnboardingData>({});

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData({});
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#fff' },
        }}
      />
    </OnboardingContext.Provider>
  );
};
