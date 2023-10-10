// React
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Libraries
import Analytics from '../libs/analytics';
import Share from 'react-native-share';

// Components
import MenuButton from './MenuButton';

// Themes
import { useTheme } from '@/Theme';

const styles = StyleSheet.create({
  barPosition: {
    position: 'absolute',
    bottom: 0,
    right: 5,
  },
});

const PdfBar = ({ title }, props) => {
  const { Layout, Gutters } = useTheme();
  console.log(title);
  Analytics.logScreen(`Descargar pdf - ${title}`, 'downlandPdf');

  const onShare = async () => {
    Analytics.logEvent(`Descargar pdf - ${title}`, 'downlandPdf');
    try {
      const result = await Share.open({
        url: props.filePath,
      })
        .then((res) => {})
        .catch((error) => {});
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={[Layout.colCenter, styles.barPosition, Gutters.smallPadding]}>
      <MenuButton imageName='sharePdf' bottomText='' action={onShare} />
    </View>
  );
};

export default PdfBar;
