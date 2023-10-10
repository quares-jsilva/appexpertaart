import React, {useEffect, useState} from 'react'
import { useTheme } from '@/Theme'
import { ListItem, CheckBox } from 'react-native-elements'
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux'

const Employee = (props) => {

    const { Fonts } = useTheme()
    const [check, setCheck] = useState(false)
    const { selectedEmployees } = useSelector((state) => state.contract )

    useEffect(() => {
        let exist = selectedEmployees.find(employee => employee.cuil === props.data.cuil)
        if(exist) {
            setCheck(true)
        }
    }, [selectedEmployees])

    const checkEmployee = () => {
        setCheck(!check)
        props.onCheck({cuil: props.data.cuil, nombre: props.data.apellidoNombre})
    }

    return (
        <TouchableOpacity onPress={() => checkEmployee()}>
            <ListItem bottomDivider >
                <ListItem.Content>
                    <ListItem.Title style={[Fonts.sourceSansSemibold]}>{'CUIL: ' + props.data.cuil}</ListItem.Title>
                    <ListItem.Subtitle style={Fonts.sourceSansLight}>{'Nombre: ' + props.data.apellidoNombre}</ListItem.Subtitle>
                </ListItem.Content>
                <CheckBox
                    textStyle={[Fonts.sourceSansSemiBold, {fontWeight: 'normal'}]}
                    checkedColor={'#389548'}
                    checked={check}
                    onPress={() => checkEmployee()}
                />
                <ListItem.Chevron />
            </ListItem>
        </TouchableOpacity>
    )
  
}

export default Employee