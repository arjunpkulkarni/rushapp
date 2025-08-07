import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import UserService from '../services/UserService';
import API from '../api/api';

const OnboardingScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phoneNumber: '',
    campusId: 'uiuc123', 
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    try {
      const response = await API.post('/auth/login', {
        username: formData.username,
        password: formData.password,
      });
      await SecureStore.setItemAsync('userToken', response.data.token);
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Could not log you in.');
      console.error(error);
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

  const renderLoginForm = () => (
    <View>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        onChangeText={(val) => handleInputChange('username', val)}
        value={formData.username}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={(val) => handleInputChange('password', val)}
        value={formData.password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => setIsLogin(false)}>
        <Text style={styles.toggleText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRegisterForm = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.label}>What's your full name?</Text>
            <TextInput
              style={styles.input}
              onChangeText={(val) => handleInputChange('name', val)}
              value={formData.name}
            />
            <Button title="Next" onPress={nextStep} />
            <TouchableOpacity onPress={() => setIsLogin(true)}>
              <Text style={styles.toggleText}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.label}>Choose a username</Text>
            <TextInput
              style={styles.input}
              onChangeText={(val) => handleInputChange('username', val)}
              value={formData.username}
              autoCapitalize="none"
            />
            <Button title="Back" onPress={prevStep} />
            <Button title="Next" onPress={nextStep} />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.label}>Create a password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(val) => handleInputChange('password', val)}
              value={formData.password}
              secureTextEntry
            />
            <Button title="Back" onPress={prevStep} />
            <Button title="Next" onPress={nextStep} />
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.label}>What's your phone number?</Text>
            <TextInput
              style={styles.input}
              onChangeText={(val) => handleInputChange('phoneNumber', val)}
              value={formData.phoneNumber}
              keyboardType="phone-pad"
            />
            <Button title="Back" onPress={prevStep} />
            <Button title="Next" onPress={nextStep} />
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.label}>Select your campus</Text>
            <Picker
              selectedValue={formData.campusId}
              onValueChange={(itemValue) => handleInputChange('campusId', itemValue)}
            >
              <Picker.Item label="University of Illinois Urbana-Champaign" value="clwyoqztc0000o5m9f8z1g1h1" />
            </Picker>
            <Button title="Back" onPress={prevStep} />
            <Button title="Submit" onPress={handleRegister} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {isLogin ? renderLoginForm() : renderRegisterForm()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formContainer: {
    width: '80%',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'blue',
  },
});

export default OnboardingScreen;
