import { Pressable } from "react-native"
import { Input } from "react-native-elements"
import Fonts from "../Theme/Fonts"
import Layout from "../Theme/Layout"
import DatePicker from '@react-native-community/datetimepicker';
import { useState } from "react";

const CustomDatePicker = ({ 
  inputPlaceholder, 
  inputPlaceholderColor, 
  inputStyle, 
  inputLabelStyle, 
  inputValue,
  onChangeText,
  inputErrorStyle,
  datePickerValue,
  minDate,
  maxDate,
  onPress,
  onChange,
}) => {

  const [showPicker, setShowPicker] = useState(false);

  const onChangeDate = (params, value) => {
    onChange(params, value);
    setShowPicker(false);
  }

  return (
    <>
      <Pressable
        onPress={() => setShowPicker(!showPicker)}
      >
        {
          <Input
            placeholder={inputPlaceholder}
            placeholderTextColor={inputPlaceholderColor}
            style={[Fonts.sourceSansRegular, {fontWeight: 'normal', textAlign: 'center' }, inputStyle]}
            labelStyle={[Fonts.sourceSansSemibold, {fontWeight: 'normal', color: 'grey'}, inputLabelStyle]}
            value={inputValue}
            onChangeText={onChangeText}
            errorStyle={inputErrorStyle}
            editable={false}
            onPressIn={onPress}
          />
        }
      </Pressable>
      {
        showPicker && (
          <DatePicker
            mode="date"
            value={datePickerValue}
            placeholder="Seleccioná una fecha"
            style={[Layout.fullWidth, { textColor: 'white' }]}
            format="DD-MM-YYYY"
            minimumDate={minDate || new Date()}
            maximumDate={maxDate}
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            onChange={onChangeDate}
          />
        )
      }
    </>
  )
}

export default CustomDatePicker;