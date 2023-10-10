import { useState, useEffect } from 'react'
import ContractApi from '@/Services/Contract/Contract'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import { showMessage } from '@/Components/MessageHelper'

const useEmployeeSearch = (filter = null, from = 1, to = 10, contractSelected) => {

    const [loading, setLoading] = useState(false)
    const [lastFilter, setLastFilter] = useState()
    const [employees, setEmployees] = useState([])
    const [lastEmployee, setLastEmployee] = useState(false)
    const { pwid } = useSelector((state) => state.user)
    const navigation = useNavigation()

    useEffect(async () => {
        let reset = false
        if(filter != lastFilter) {
            reset = true
        }
        if(pwid != null && contractSelected != null) {
            setLoading(true)
            try {
                const response = await ContractApi.getEmployees({
                    contratoId: contractSelected.nro_contrato,
                    apellidoNombre: filter,
                    ordenarPor: 'apellidoNombre',
                    pagina: from,
                })
                const resultEmployees = response.data.listado
                if(reset){
                    setEmployees(resultEmployees)
                } else {
                    setEmployees([...employees, ...resultEmployees])
                }
                setLastEmployee(from === response.data.paginas)
                setLastFilter(filter)
            } catch(error) {
                showMessage({
                    'message': error.message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack()
                    },
                    'buttonHelp': { 
                        'onPress': () => navigation.navigate('ProblemReport', { errorFrom: 'EmployeeSearch' }) 
                    }
                })
            } finally {
                setLoading(false)
            }
        }
    }, [pwid, contractSelected, from, to, filter])

    return {loading, employees, lastEmployee}
}

export { useEmployeeSearch }