import React, { useState, useEffect } from 'react'
import { Keyboard, InputAccessoryView, Button, View } from 'react-native'
import { useTheme } from '@/Theme'
import { Input } from 'react-native-elements'

const NumberInput = (props) => {

  const { Layout, Fonts } = useTheme()
  const [number, setNumber] = useState()
  const inputAccessoryViewID = 'uniqueID';

  useEffect(() => {
    setNumber(props.value)
  }, [props.value])

  const handleInputChange = (value) => {
    if (/^\d+$/.test(value) || value === '') {
        setNumber(value)
        props.onChange(value)
    }
  }

  return (
    <>
      <Input
          label={props.label}
          containerStyle={props.containerStyle}
          style={props.style}
          labelStyle={props.labelStyle}
          value={number}
          onChangeText={value => handleInputChange(value)}
          errorStyle={props.errorStyle}
          errorMessage={props.errorMessage}
          keyboardType={'numeric'}
          inputAccessoryViewID={inputAccessoryViewID}
      />
      <InputAccessoryView nativeID={inputAccessoryViewID}>
        <View style={{flexDirection: 'row', justifyContent: "flex-end", backgroundColor: 'gainsboro'}}>
          <Button
            onPress={() => Keyboard.dismiss()}
            title="Aceptar"
          />
        </View>
      </InputAccessoryView>
    </>
  )

}

export default NumberInput