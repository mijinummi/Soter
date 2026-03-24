import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/useAppTheme';
import { useBiometric } from '../contexts/BiometricContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AidDetails'>;

export const AidDetailsScreen: React.FC<Props> = ({ route }) => {
  const { aidId } = route.params;
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { biometricEnabled, authenticate } = useBiometric();

  // null = not yet attempted, true = granted, false = denied
  const [authState, setAuthState] = useState<'idle' | 'pending' | 'granted' | 'denied'>('idle');

  const requestAuth = useCallback(async () => {
    if (!biometricEnabled) {
      setAuthState('granted');
      return;
    }
    setAuthState('pending');
    const success = await authenticate();
    setAuthState(success ? 'granted' : 'denied');
  }, [biometricEnabled, authenticate]);

  // Trigger auth on mount
  useEffect(() => {
    void requestAuth();
  }, [requestAuth]);

  if (authState === 'idle' || authState === 'pending') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
        <Text style={styles.subtitle}>Verifying identity…</Text>
      </View>
    );
  }

  if (authState === 'denied') {
    return (
      <View style={styles.centered}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.title}>Authentication Required</Text>
        <Text style={styles.subtitle}>
          Biometric verification is needed to view this screen.
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.button, { backgroundColor: colors.brand.primary }]}
          onPress={requestAuth}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // authState === 'granted'
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aid Details</Text>
      <Text style={styles.subtitle}>ID: {aidId}</Text>
      <Text style={styles.subtitle}>Coming Soon in a future wave</Text>
    </View>
  );
};

const makeStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 32,
      gap: 16,
    },
    lockIcon: {
      fontSize: 48,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: 'center',
    },
    button: {
      marginTop: 8,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });
