/**
 * This file contains all application's style relative to fonts
 */
import { StyleSheet } from 'react-native'

/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ FontSize, Colors }) {
  return StyleSheet.create({
    textSmall: {
      fontSize: FontSize.small,
      color: Colors.text,
    },
    textRegular: {
      fontSize: FontSize.regular,
      color: Colors.text,
    },
    textLarge: {
      fontSize: FontSize.large,
      color: Colors.text,
    },
    titleSmall: {
      fontSize: FontSize.small * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleRegular: {
      fontSize: FontSize.regular * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    titleLarge: {
      fontSize: FontSize.large * 2,
      fontWeight: 'bold',
      color: Colors.text,
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },
    textLeft: {
      textAlign: 'left',
    },
    textRight: {
      textAlign: 'right',
    },
    sourceSansBlack: {
      fontFamily: 'SourceSansPro-Black'
    },
    sourceSansBlackIt: {
      fontFamily: 'SourceSansPro-BlackIt'
    },
    sourceSansBold: {
      fontFamily: 'SourceSansPro-Bold'
    },
    sourceSansBoldIt: {
      fontFamily: 'SourceSansPro-BoldIt'
    },
    sourceSansExtraLight: {
      fontFamily: 'SourceSansPro-ExtraLight'
    },
    sourceSansExtraLightIt: {
      fontFamily: 'SourceSansPro-ExtraLightIt'
    },
    sourceSansIt: {
      fontFamily: 'SourceSansPro-It'
    },
    sourceSansLight: {
      fontFamily: 'SourceSansPro-Light'
    },
    sourceSansLightIt: {
      fontFamily: 'SourceSansPro-LightIt'
    },
    sourceSansRegular: {
      fontFamily: 'SourceSansPro-Regular'
    },
    sourceSansSemibold: {
      fontFamily: 'SourceSansPro-Semibold'
    },
    sourceSansSemiboldIt: {
      fontFamily: 'SourceSansPro-SemiboldIt'
    },
    sourceSerifBlack: {
      fontFamily: 'SourceSerifPro-Black'
    },
    sourceSerifBold: {
      fontFamily: 'SourceSerifPro-Bold'
    },
    sourceSerifExtraLight: {
      fontFamily: 'SourceSerifPro-ExtraLight'
    },
    sourceSerifLight: {
      fontFamily: 'SourceSerifPro-Light'
    },
    sourceSerifRegular: {
      fontFamily: 'SourceSerifPro-Regular'
    },
    sourceSerifSemibold: {
      fontFamily: 'SourceSerifPro-Semibold'
    },
  })
}
