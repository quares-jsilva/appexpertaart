import React, { useState, useEffect } from 'react'
import { useTheme } from '@/Theme'
import { Input } from 'react-native-elements'

const NumberInput = (props) => {

  const { Layout, Fonts } = useTheme()
  const [number, setNumber] = useState()

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
    />
  )

}

export default NumberInput