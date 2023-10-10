import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getContractsClient, getAffiliatedInsurance } from '@/Store/Contract'
import { permissions } from '@/Store/User/userDefinitions'
import { viewer } from '@/Store/User/userDefinitions'

const useContracts= ({viewAs = viewer.AFILIADO, filterText = '', from = 0, to = 9}) => {
    const dispatch = useDispatch()

    const[ contracts, setContracts] = useState([])
    const [lastContract, setLastContract] = useState(false)
    const { isAuthenticated } = useSelector((state) => state.auth )
    const { profiles, pwid, data } = useSelector((state) => state.user)
    const { clientContracts, affiliatedContracts, loading, status } = useSelector((state) => state.contract )

    const search = (searched, text) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                .includes(
                    searched.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                )
    }

    const searchContracts = async () => {
        if(isAuthenticated && !loading && profiles.includes("USER_ART_CLIENTE") && 
            ((clientContracts && clientContracts.length === 0) || status === 'error' || filterText !== '')
        ) {
            await dispatch(getContractsClient({pagina: 0, filtro: ''}))
        }
    }

    const searchAffiliatedInsurance = () => {
        if(isAuthenticated && !loading /*&& profiles.includes("USER_ART_AFILIADO")*/) {
                dispatch(getAffiliatedInsurance(data.documento))
        }
    }

    useEffect(() => {
        if(viewAs === viewer.CLIENTE && (clientContracts && clientContracts.length > 0)) {
            setContracts(clientContracts)
        }else if (viewAs === viewer.AFILIADO && (affiliatedContracts && affiliatedContracts.length > 0)){
            if(filterText) {
                setContracts(
                    affiliatedContracts.filter( contract => 
                        search(filterText, contract.razon_social) ||
                        contract.cuit.includes(filterText)
                    )
                )
            }else{
                setContracts(affiliatedContracts)
            }
        }
    }, [viewAs, filterText, clientContracts, affiliatedContracts])

    const validatePermission = (pagePermission) => {
        permissions[pagePermission].indexOf(parseInt(n)) !== -1
    }  

    return {contracts, loading, lastContract, validatePermission, searchContracts, searchAffiliatedInsurance}
}

export {useContracts}