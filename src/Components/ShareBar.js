// React
import React from 'react';
import { View, StyleSheet } from 'react-native';

// Libraries
import { captureRef } from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import Analytics from '../libs/analytics';
import Share from 'react-native-share';

// Components
import MenuButton from './MenuButton';

// Themes
import { useTheme } from '@/Theme';

const styles = StyleSheet.create({
  text: {
    color: '#000',
    textAlign: 'center',
    fontSize: 10,
    marginTop: -15,
  },
});

const ShareBar = (props) => {
  const { Layout } = useTheme();
  const navigation = useNavigation();
  Analytics.logScreen('Descargar credenciales', 'ShareBar');

  const onShare = async () => {
    Analytics.logEvent('Descargar credenciales', 'ShareBar');
    try {
      const uri = await captureRef(props.sharedRef, {
        format: 'png',
        quality: 0.8,
      });

      const result = await Share.open({
        url: uri,
      })
        .then((res) => {})
        .catch((error) => {});
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={(Layout.colCenter, Layout.justifyContentAround)}>
      <MenuButton imageName='sharePdf' bottomText='' action={onShare} />
      {props.ShowBackButton && (
        <MenuButton
          imageName='back'
          bottomText=''
          action={() => navigation.goBack()}
        />
      )}
    </View>
  );
};

export default ShareBar;
