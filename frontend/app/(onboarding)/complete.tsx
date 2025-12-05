import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useOnboarding } from './_layout';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../services/userService';

type Badge = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

export default function Complete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const { data, resetData } = useOnboarding();
  const { user, refreshProfile } = useAuth();

  useEffect(() => {
    completeOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeOnboarding = async () => {
    if (!user) {
      setError('No user found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await updateUserProfile({
        username: data.username,
        primaryLanguage: data.primaryLanguage,
        secondaryLanguage: data.secondaryLanguage,
        // profilePicture: data.profilePicture,
        country: data.country,
        city: data.city,
        favoriteGenres: data.favoriteGenres,
        onboardingCompleted: true,
      });

      // Refresh profile in AuthContext to get updated data (including badges)
      await refreshProfile();

      // Clear onboarding data
      resetData();

      const newBadges = res?.newBadges ?? [];

      if (newBadges.length > 0) {
        // show the first badge (welcome)
        setUnlockedBadge(newBadges[0]);
        setShowBadgeModal(true);
      } else {
        // no new badge (maybe user redid onboarding) → normal redirect
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 1500);
      }
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError(err.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseBadge = () => {
    setShowBadgeModal(false);
    router.replace('/(tabs)/home');
  };

  if (loading && !showBadgeModal) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Creating your profile...</Text>
        <ActivityIndicator size="large" color="#9A0169" style={styles.loader} />
      </View>
    );
  }

  if (error && !showBadgeModal) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Oops! Something went wrong</Text>
        <Text style={styles.error}>{error}</Text>
        <Text style={styles.retry} onPress={completeOnboarding}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All set! 🎉</Text>
      <Text style={styles.subtitle}>Welcome to CineCircle</Text>

      {/* Badge popup */}
      <Modal
        visible={showBadgeModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseBadge}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New badge unlocked!</Text>

            {unlockedBadge && (
              <>
                <Text style={styles.modalIcon}>{unlockedBadge.icon}</Text>
                <Text style={styles.modalBadgeName}>{unlockedBadge.name}</Text>
                <Text style={styles.modalBadgeDesc}>
                  {unlockedBadge.description}
                </Text>
              </>
            )}

            <TouchableOpacity style={styles.modalButton} onPress={handleCloseBadge}>
              <Text style={styles.modalButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
  error: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  retry: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  modalIcon: {
    fontSize: 40,
    marginVertical: 8,
  },
  modalBadgeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  modalBadgeDesc: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 4,
  },
  modalButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#9A0169',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
