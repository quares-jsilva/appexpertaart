import { useState, useEffect } from 'react'
import { permissions } from '@/Store/User/userDefinitions'

const usePermissions = (contract) => {
    const[hasPermission, setHasPermission] = useState({})

    useEffect(() => {
        let initialState = {}
        if(contract && contract.permiso) {
            for(const permission in permissions) {
                initialState[permission] = permissions[permission].find(id => contract.permiso.includes(id)) !== undefined
            }
        }

        setHasPermission(initialState)
    }, [contract])
    

    return {hasPermission}
}

export { usePermissions }