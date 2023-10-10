import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReferentApi from '@/Services/Referent/Referent'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from '@/Components/MessageHelper'

const useReferents = ({contractSelected, filterText = ''}) => {

    const [referentData, setReferentData] = useState()
    const [referents, setReferents] = useState([])
    const [positions, setPositions] = useState([])
    const [types, setTypes] = useState([])
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(false)
    const { profiles, pwid } = useSelector((state) => state.user)
    const { affiliatedContractSelected, clientContractSelected } = useSelector((state) => state.contract )
    const navigation = useNavigation()

    const getPositions = async () => {
        try {
            const response = await ReferentApi.getPositions()
            setPositions(response.data)
        } catch(error) {
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.goBack(),
                },
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                }
            })
        }
    }

    const getTypes = async () => {
        try {
            const response = await ReferentApi.getTypes()
            setTypes(response.data)
        } catch(error) {
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.goBack(),
                },
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                }
            })
        }
    }

    const getBranches = async (contractId) => {
        try {
            const response = await ReferentApi.getBranches(contractId)
            setBranches(response.data)
        } catch(error) {
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.goBack(),
                },
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                }
            })
        }
    }

    const getReferent = async (params) => {
        try {
            setLoading(true)
            const response = await ReferentApi.getReferent(params)
            setReferentData(response.data)
            setLoading(false)
        } catch(error) {
            setLoading(false)
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.goBack(),
                },
                'buttonHelp': {
                    onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                }
            })
        }
    }

    const updateReferent = async (params) => {
        try {
            setLoading(true)
            const response = await ReferentApi.updateReferent({contractId: params.contractSelected.nro_contrato, referentId: params.referentId, datos: params.datos})
            setLoading(false)
            showMessage({
                'message': 'Se actualizó el referente', 
                'type': 'success',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.navigate('ReferentList', {contractSelected: {...params.contractSelected, updated: true}}),
                },
            })
        } catch(error) {
            setLoading(false)
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                    }
                }
            })
        }
    }

    const deleteReferent = async (params) => {
        try {
            setLoading(true)
            const response = await ReferentApi.deleteReferent({contractId: params.contractSelected.nro_contrato, referentId: params.referentId})
            setLoading(false)
            showMessage({
                'message': 'Se eliminó el referente', 
                'type': 'success',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.navigate('ReferentList', {contractSelected: {...params.contractSelected, updated: true}}),
                },
            })
        } catch(error) {
            setLoading(false)
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                    }
                }
            })
        }
    }

    const addReferent = async (params) => {
        try {
            setLoading(true)
            const response = await ReferentApi.addReferent({contractId: params.contractSelected.nro_contrato, datos: params.datos})
            setLoading(false)
            showMessage({
                'message': 'Se agregó el referente', 
                'type': 'success',
                'button': {
                    'text': 'Aceptar',
                    'onPress': () => navigation.navigate('ReferentList', {contractSelected: {...params.contractSelected, updated: true}}),
                },
            })
        } catch(error) {
            setLoading(false)
            showMessage({
                'message': error.message, 
                'type': 'error',
                'button': {
                    'text': 'Aceptar',
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentEdit' }) 
                    }
                }
            })
        }
    }

    useEffect(async () => {
        if(!!contractSelected){
            setLoading(true)
            try {
                const response = await ReferentApi.getReferents({
                    poliza: contractSelected.nro_contrato,
                    ordenamiento: 'APELLIDO_NOMBRE',
                    apellidoNombre: filterText,
                    pagina: 0
                })
                if(!response.data) {
                    showMessage({
                        'message': response.message, 
                        'type': 'error',
                        'button': {
                            'text': 'Aceptar',
                            'onPress': () => navigation.goBack(),
                        },
                        'buttonHelp': {
                            onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentList' }) 
                        }
                    })
                }
                setReferents(response.data)
            } catch(error) {
                showMessage({
                    'message': error.message, 
                    'type': 'error',
                    'button': {
                        'text': 'Aceptar',
                        'onPress': () => navigation.goBack(),
                    },
                    'buttonHelp': {
                        onPress: () => navigation.navigate('ProblemReport', { errorFrom: 'ReferentList' }) 
                    }
                })
            } finally {
                setLoading(false)
            }
        }
    }, [contractSelected, filterText])

    return {
        referents, 
        loading,
        positions, 
        types, 
        branches,
        referentData,
        getPositions, 
        getTypes,
        getBranches,
        addReferent,
        getReferent,
        updateReferent,
        deleteReferent
    }
}

export { useReferents }