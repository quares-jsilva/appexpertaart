// React
import React from 'react';
import { View, Image, Text } from 'react-native';

// Libraries
import { ListItem } from 'react-native-elements';
import { openApp } from '@/libs/deepLinks';
import { useSelector } from 'react-redux';
import Analytics from '../libs/analytics';

// Themes
import { useTheme } from '@/Theme';

const ButtonSeguros = (props) => {
  const { Layout, Common, Images, Fonts, Gutters } = useTheme();
  const { credentials, tokenIdentityManager, tokenApiManager, tokenKeycloak } =
    useSelector((state) => state.auth);

  return (
    <ListItem
      style={[Layout.fullWidth]}
      containerStyle={Common.card}
      onPress={() => {
        Analytics.logEvent('IrASeguros', 'IrASeguros');
        let params = btoa(
          JSON.stringify({
            ...credentials,
            tokenIdentityManager: tokenIdentityManager.accessToken,
            tokenApiManager: tokenApiManager.accessToken,
            tokenKeycloak: tokenKeycloak.accessToken,
          })
        );
        openApp('appseguros://seguros/' + params);
      }}
    >
      {props.screen === 'dashboard' ? (
        <>
          <View style={[Layout.fill, Layout.rowCenter]}>
            <Image
              style={{ width: 80, height: 80 }}
              resizeMode={'contain'}
              source={Images['segurosPhone']}
            />
            <Text
              style={[
                Gutters.smallTMargin,
                Gutters.regularLMargin,
                Fonts.sourceSansSemiBold,
                { color: '#4db8e8', fontSize: 17 },
              ]}
            >
              {'Ingresar a la App\n'}
              <Text style={[Fonts.sourceSansBold, { fontSize: 18 }]}>
                {'Experta Seguros'}
              </Text>
            </Text>
          </View>
          <ListItem.Chevron color={'grey'} size={30} />
        </>
      ) : (
        <>
          <Image
            style={{ height: 35, width: 35 }}
            resizeMode={'contain'}
            source={Images['drawerSeguros']}
          />
          <View style={[Layout.fill, Gutters.regularLPadding]}>
            <Text style={[Fonts.sourceSansSemiBold, { color: 'grey' }]}>
              {'Ingresar a la App Experta Seguros'}
            </Text>
          </View>
          <ListItem.Chevron color={'grey'} size={25} />
        </>
      )}
    </ListItem>
  );
};

export default ButtonSeguros;
