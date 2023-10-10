import React from 'react'
import { Text, View, Image } from 'react-native'
import { useTheme } from '@/Theme'
import * as Animatable from 'react-native-animatable'
import { Button } from 'react-native-elements'
import { useSelector } from 'react-redux'
import { assistanceNumber } from '@/Config'
import { openApp, makeCall } from '@/libs/deepLinks'

const ProductSlide = (props) => {

  const { Layout, Images, Common, Gutters, Fonts } = useTheme()
  const { credentials, tokenIdentityManager, tokenApiManager, tokenKeycloak } = useSelector((state) => state.auth )

  return(
    <Animatable.View animation={props.animate} duration={700} style={[{maxHeight: 220}, Gutters.regularTMargin]}>
      <View style={[[Common.card, Layout.center, {height:'100%', maxHeight: 220}]]}>
          <Image 
            source={Images[props.imageName]} 
            resizeMode='stretch' 
            style={{width:'100%', flex: 1, opacity: 0.2}}
          />
          <View style={[
            {
              overflow: "hidden",
              position:'absolute',
              left: 20,
              top: 5, 
              width: '100%',
              height: '100%',
            }
          ]}>
            <Image 
              source={Images[props.logoName]} 
              resizeMode="cover"
              style={[
                {
                  width: '30%',
                  height: '30%'
                }
              ]}
            />
            <View style={{width: '90%'}}>
              <Text style={[Fonts.sourceSansSemiBold, {color: 'grey', fontSize: 18, textAlign: 'left'}]}>{props.text}</Text>
            </View>
          </View>
          <View style={[Layout.rowCenter, Gutters.smallVMargin, Gutters.smallHPadding]}>
            <Button 
                containerStyle={[Gutters.smallRMargin, {width: '50%'}]}
                buttonStyle={[Gutters.smallRMargin, {borderRadius: 10, backgroundColor: '#389548'}]}
                titleStyle={Fonts.sourceSansSemiBold}
                title={'Emergencias  '}
                icon={
                  <Image 
                    source={Images['phoneWhite']} 
                    resizeMode="cover"
                    style={[
                      {
                        width: '20%',
                        height: '100%'
                      }
                    ]}
                  />
                }
                iconRight
                onPress={() => makeCall(assistanceNumber)}
            />
            <Button 
                containerStyle={{width: '50%'}}
                buttonStyle={[{borderRadius: 10, borderColor: '#389548', borderWidth: 1, backgroundColor: 'white'}]}
                titleStyle={[Fonts.sourceSansSemiBold, {color: '#389548'}]}
                title={'Ir a Seguros'}
                onPress={() => {
                    let params = btoa(JSON.stringify({
                        ...credentials,
                        tokenIdentityManager: tokenIdentityManager.accessToken,
                        tokenApiManager: tokenApiManager.accessToken,
                        tokenKeycloak: tokenKeycloak.accessToken
                    }))
                    openApp('appseguros://seguros/' + params)
                }}
            />
          </View>
      </View>
    </Animatable.View>
    
  )

}

export default ProductSlide