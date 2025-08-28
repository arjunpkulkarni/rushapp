import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledText } from './StyledText';
import { Colors } from '../constants/Colors';

export default function LiveBanner() {
  return (
    <View style={styles.banner}>
      <View style={styles.dot} />
      <StyledText semibold style={{ color: Colors.white }}>LIVE</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignSelf: 'flex-start',
    backgroundColor: '#ef444455',
    borderColor: '#ef4444',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});


