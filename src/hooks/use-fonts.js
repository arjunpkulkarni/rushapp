import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'NeueMontreal-Regular': require('../../assets/fonts/NeueMontreal-Regular.otf'),
    'NeueMontreal-Medium': require('../../assets/fonts/NeueMontreal-Medium.otf'),
    'NeueMontreal-Bold': require('../../assets/fonts/NeueMontreal-Bold.otf'),
    'NeueMontreal-Italic': require('../../assets/fonts/NeueMontreal-Italic.otf'),
    'NeueMontreal-MediumItalic': require('../../assets/fonts/NeueMontreal-MediumItalic.otf'),
    'NeueMontreal-BoldItalic': require('../../assets/fonts/NeueMontreal-BoldItalic.otf'),
    'NeueMontreal-Light': require('../../assets/fonts/NeueMontreal-Light.otf'),
    'NeueMontreal-LightItalic': require('../../assets/fonts/NeueMontreal-LightItalic.otf'),
  });

  return fontsLoaded;
};
