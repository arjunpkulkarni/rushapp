import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function StyledText(props) {
  const { style, light, medium, bold, italic, ...rest } = props;

  const getFontFamily = () => {
    if (bold && italic) return 'NeueMontreal-BoldItalic';
    if (bold) return 'NeueMontreal-Bold';
    if (medium && italic) return 'NeueMontreal-MediumItalic';
    if (medium) return 'NeueMontreal-Medium';
    if (light && italic) return 'NeueMontreal-LightItalic';
    if (light) return 'NeueMontreal-Light';
    if (italic) return 'NeueMontreal-Italic';
    return 'NeueMontreal-Regular';
  };

  return (
    <Text
      {...rest}
      style={[
        { fontFamily: getFontFamily() },
        style,
      ]}
    />
  );
}
