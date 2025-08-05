import React from 'react';
import { Text } from 'react-native';

export function StyledText(props) {
  const { style, light, medium, semibold, italic, ...rest } = props;

  const getFontFamily = () => {
    if (semibold && italic) return 'NeueMontreal-BoldItalic';
    if (semibold) return 'NeueMontreal-Bold';
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
