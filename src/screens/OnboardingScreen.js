import React from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import UserService from '../services/UserService';
import API from '../api/api';
import { StyledText } from '../components/StyledText';
import { LinearGradient } from 'expo-linear-gradient';
import { useAtom } from 'jotai';
import { isLoginAtom, onboardingStepAtom, loginStepAtom, formDataAtom, otpCodeAtom, otpSentAtom } from '../state/atoms';

const OnboardingScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom);
  const [step, setStep] = useAtom(onboardingStepAtom);
  const [loginStep, setLoginStep] = useAtom(loginStepAtom);
  const [formData, setFormData] = useAtom(formDataAtom);
  const [otpCode, setOtpCode] = useAtom(otpCodeAtom);
  const [otpSent, setOtpSent] = useAtom(otpSentAtom);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSendLoginCode = async () => {
    try {
      if (!formData.phoneNumber) return Alert.alert('Phone required');
      await API.post('/auth/otp/start', { phoneNumber: formData.phoneNumber });
      setOtpSent(true);
      setLoginStep(2);
    } catch (e) {
      Alert.alert('Error', 'Could not send code');
    }
  };

  const handleVerifyLoginCode = async () => {
    try {
      const response = await API.post('/auth/otp/verify', { phoneNumber: formData.phoneNumber, code: otpCode });
      await SecureStore.setItemAsync('userToken', response.data.token);
      navigation.navigate('Main');
    } catch (e) {
      Alert.alert('Error', 'Invalid code');
    }
  };

  const handleRegister = async () => {
    try {
      await UserService.createUser(formData);
      Alert.alert('Success', 'Your account has been created! Please log in.');
      setIsLogin(true);
    } catch (error) {
      Alert.alert('Error', 'Could not create your account.');
      console.error(error);
    }
  };

  const ProgressDots = ({ total, active }) => (
    <View style={styles.dotsContainer}>
      {Array.from({ length: total }).map((_, idx) => (
        <View key={`dot-${idx}`} style={[styles.dot, idx + 1 === active && styles.dotActive]} />
      ))}
    </View>
  );

  const PrimaryButton = ({ title, onPress }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.primaryButton}>
      <StyledText semibold style={styles.primaryButtonText}>{title}</StyledText>
    </TouchableOpacity>
  );

  const GhostButton = ({ title, onPress }) => (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.ghostButton}>
      <StyledText semibold style={styles.ghostButtonText}>{title}</StyledText>
    </TouchableOpacity>
  );

  const renderLoginForm = () => (
    <View>
      <ImageBackground source={require('../pictures/running.png')} resizeMode="contain" style={styles.heroImage}>
        <LinearGradient colors={["rgba(15,23,42,0)", "rgba(15,23,42,0.7)"]} style={styles.heroScrim} />
        <View style={styles.heroText}>
          <StyledText semibold style={styles.title}>Welcome back</StyledText>
          <StyledText style={styles.subtitle}>Log in to continue your Rush</StyledText>
        </View>
      </ImageBackground>
      {loginStep === 1 && (
        <>
          <StyledText medium style={styles.label}>Phone number</StyledText>
          <TextInput
            style={styles.input}
            placeholder="+1 555 555 5555"
            placeholderTextColor="#6b7280"
            onChangeText={(val) => handleInputChange('phoneNumber', val)}
            value={formData.phoneNumber}
            keyboardType="phone-pad"
          />
          <PrimaryButton title="Send code" onPress={handleSendLoginCode} />
        </>
      )}
      {loginStep === 2 && (
        <>
          <StyledText medium style={styles.label}>Enter code</StyledText>
          <TextInput
            style={styles.input}
            placeholder="123456"
            placeholderTextColor="#6b7280"
            onChangeText={setOtpCode}
            value={otpCode}
            keyboardType="number-pad"
          />
          <GhostButton title="Back" onPress={() => setLoginStep(1)} />
          <PrimaryButton title="Verify & Log in" onPress={handleVerifyLoginCode} />
        </>
      )}
      <TouchableOpacity onPress={() => { setIsLogin(false); setLoginStep(1); }}>
        <StyledText style={styles.toggleText}>Don't have an account? Sign up</StyledText>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <ImageBackground source={require('../pictures/running.png')} resizeMode="contain" style={styles.heroImage}>
              <LinearGradient colors={["rgba(15,23,42,0)", "rgba(15,23,42,0.7)"]} style={styles.heroScrim} />
              <View style={styles.heroText}>
                <StyledText semibold style={styles.title}>Verify your phone</StyledText>
                <StyledText style={styles.subtitle}>We'll text you a 6‑digit code</StyledText>
              </View>
            </ImageBackground>
            <StyledText medium style={styles.label}>Phone number</StyledText>
            <TextInput
              style={styles.input}
              placeholder="+1 555 555 5555"
              placeholderTextColor="#6b7280"
              onChangeText={(val) => handleInputChange('phoneNumber', val)}
              value={formData.phoneNumber}
              keyboardType="phone-pad"
            />
            <PrimaryButton title="Send code" onPress={async () => {
              try {
                await API.post('/auth/otp/start', { phoneNumber: formData.phoneNumber });
                setOtpSent(true);
                nextStep();
              } catch (e) {
                Alert.alert('Error', 'Could not send code');
              }
            }} />
            <TouchableOpacity onPress={() => setIsLogin(true)}>
              <StyledText style={styles.toggleText}>Already have an account? Log in</StyledText>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <LinearGradient colors={["#1d4ed8", "#0ea5e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard} />
            <StyledText semibold style={[styles.title, { color: 'black' }]}>Enter code</StyledText>
            <StyledText style={styles.subtitle}>Sent to {formData.phoneNumber || 'your phone'}</StyledText>
            <StyledText medium style={styles.label}>6‑digit code</StyledText>
            <TextInput
              style={styles.input}
              placeholder="123456"
              placeholderTextColor="#6b7280"
              onChangeText={setOtpCode}
              value={otpCode}
              keyboardType="number-pad"
            />
            <GhostButton title="Back" onPress={prevStep} />
            <PrimaryButton title="Verify" onPress={async () => {
              try {
                const res = await API.post('/auth/otp/verify', { phoneNumber: formData.phoneNumber, code: otpCode });
                await SecureStore.setItemAsync('userToken', res.data.token);
                setOtpSent(false);
                nextStep();
              } catch (e) {
                Alert.alert('Error', 'Invalid code');
              }
            }} />
          </View>
        );
      case 3:
        return (
          <View>
            <LinearGradient colors={["#1d4ed8", "#0ea5e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard} />
            <StyledText semibold style={styles.title}>Your details</StyledText>
            <StyledText style={styles.subtitle}>Tell us your name</StyledText>
            <StyledText medium style={styles.label}>What's your full name?</StyledText>
            <TextInput
              style={styles.input}
              placeholder="Alex Johnson"
              placeholderTextColor="#6b7280"
              onChangeText={(val) => handleInputChange('name', val)}
              value={formData.name}
            />
            <GhostButton title="Back" onPress={prevStep} />
            <PrimaryButton title="Next" onPress={nextStep} />
          </View>
        );
      case 4:
        return (
          <View>
            <LinearGradient colors={["#1d4ed8", "#0ea5e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard} />
            <StyledText semibold style={styles.title}>Make it yours</StyledText>
            <StyledText style={styles.subtitle}>Pick a unique username</StyledText>
            <StyledText medium style={styles.label}>Choose a username</StyledText>
            <TextInput
              style={styles.input}
              placeholder="alexj"
              placeholderTextColor="#6b7280"
              onChangeText={(val) => handleInputChange('username', val)}
              value={formData.username}
              autoCapitalize="none"
            />
            <GhostButton title="Back" onPress={prevStep} />
            <PrimaryButton title="Next" onPress={nextStep} />
          </View>
        );
      case 5:
        return (
          <View>
            <LinearGradient colors={["#1d4ed8", "#0ea5e9"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard} />
            <StyledText semibold style={styles.title}>Where do you Rush?</StyledText>
            <StyledText style={styles.subtitle}>Select your campus</StyledText>
            <Picker
              selectedValue={formData.campusId}
              onValueChange={(itemValue) => handleInputChange('campusId', itemValue)}
            >
              <Picker.Item label="University of Illinois Urbana-Champaign" value="clwyoqztc0000o5m9f8z1g1h1" />
            </Picker>
            <GhostButton title="Back" onPress={prevStep} />
            <PrimaryButton title="Sign up" onPress={async () => {
              try {
                await UserService.completeUser({
                  name: formData.name,
                  username: formData.username,
                  phoneNumber: formData.phoneNumber,
                  campusId: formData.campusId,
                });
                navigation.navigate('Main');
              } catch (e) {
                Alert.alert('Error', 'Could not finish signup');
              }
            }} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        style={{ flex: 1, width: '100%' }}
      >
        <View style={styles.header}>
          <StyledText semibold style={styles.brand}>Rush</StyledText>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            {isLogin ? renderLoginForm() : renderRegisterForm()}
            <View style={styles.inlineDots}>
              {isLogin ? (
                <ProgressDots total={2} active={loginStep} />
              ) : (
                <ProgressDots total={5} active={step} />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#e9f0ec',
  },
  formContainer: {
    width: '88%',
    alignSelf: 'center',
    paddingBottom: 16,
  },
  inlineDots: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerDots: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
  header: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  brand: {
    fontSize: 28,
    color: '#0b1736',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#0b1736',
  },
  input: {
    borderWidth: 1,
    borderColor: '#304567',
    backgroundColor: '#ffffff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 14,
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#113d2c',
  },
  title: {
    fontSize: 28,
    color: 'black',
    marginTop: 0,    
    paddingLeft: 0,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#e6f0ea',
    paddingLeft: 0,
  },
  heroImage: {
    width: '100%',
    height: 360,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
  },
  heroScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroText: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  dotActive: {
    width: 22,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#0ea5e9',
  },
  primaryButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
    marginTop: 8,
    marginBottom: 8,
  },
  ghostButtonText: {
    color: '#0ea5e9',
    fontSize: 16,
  },
});

export default OnboardingScreen;
