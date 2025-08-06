import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import UserService from '../services/UserService';

const OnboardingScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phoneNumber: '',
    campusId: 'clwyoqztc0000o5m9f8z1g1h1', // Hardcoded for UIUC
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await UserService.createUser(formData);
      Alert.alert('Success', 'Your account has been created!');
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Error', 'Could not create your account.');
      console.error(error);
    }
  };

  const renderStep = () => {
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
      case 4:
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
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>{renderStep()}</View>
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
});

export default OnboardingScreen;
