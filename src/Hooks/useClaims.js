import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getClaimsAffiliated, getClaimsClient } from '@/Store/Claim'

const useClaims= () => {
    const dispatch = useDispatch()
    const { profiles, data } = useSelector((state) => state.user)
    const { hasClaim, claims, myClaims, loading, status } = useSelector((state) => state.claim)
    const { affiliatedContracts, clientContractSelected } = useSelector((state) => state.contract )
    const [ lastClaim, setLastClaim] = useState(false)

    useEffect(() => {
        if((myClaims.length === 0 || status === 'error') && 
        profiles.includes("USER_ART_AFILIADO") && 
        (affiliatedContracts && affiliatedContracts.length > 0)){
            dispatch(getClaimsAffiliated(
                {
                    polizas: affiliatedContracts.map(contract => contract.nro_contrato),
                    dni: data.documento
                }
            ))
        }
    }, [affiliatedContracts])

    useEffect(() => {
        if((claims.length === 0 || status === 'error') && 
        profiles.includes("USER_ART_CLIENTE") && 
        clientContractSelected && 
        clientContractSelected.nro_contrato){
            dispatch(getClaimsClient(
                {
                    nroPoliza: clientContractSelected.nro_contrato
                }
            ))
        }
    }, [clientContractSelected])
    

    return {hasClaim, claims, myClaims, loading, lastClaim}
}

export {useClaims}