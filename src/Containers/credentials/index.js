// React
import React, { useRef, useEffect } from 'react';
import { View, Image, ScrollView } from 'react-native';

// Libraries
import Analytics from '../../libs/analytics';

// Components
import ShareBar from '../../Components/ShareBar';

// Themes
import { useTheme } from '@/Theme';

const CredentialsContainer = () => {
  const { Layout, Gutters, Images } = useTheme();
  const ref = useRef(null);

  useEffect(() => {
    Analytics.logScreen('Credenciales', 'CredentialsContainer');
  }, []);

  return (
    <ScrollView contentContainerStyle={Layout.fill}>
      <View style={[Layout.fill, Layout.colCenter]}>
        <Image source={Images['credential']} />
        <Image
          style={{ opacity: 0, top: 0, position: 'absolute' }}
          ref={ref}
          source={Images['credentialExport']}
        />
      </View>
      <View style={[Layout.alignItemsEnd, Gutters.smallRPadding]}>
        <ShareBar title='Credenciales' sharedRef={ref} />
      </View>
    </ScrollView>
  );
};

export default CredentialsContainer;
