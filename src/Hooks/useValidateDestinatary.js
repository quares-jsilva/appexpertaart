import { useState, useEffect } from 'react'

const useValidateDestinatary= () => {
    const [destinatary, setDestinatary] = useState('')
    const [isNotValidDestinatary, setIsNotValidDestinatary] = useState(true)
    const [errorDestinataryMessage, setErrorDestinataryMessage] = useState('')
    
    const validateDestinatary = (value) => {
        setDestinatary(value)
        if(value == '') {
            setIsNotValidDestinatary(true)
            setErrorDestinataryMessage('Ingresá un destinatario')
        } else if(value.length > 200){
            setIsNotValidDestinatary(true)
            setErrorDestinataryMessage('El destinatario puede tener hasta 200 caracteres')
        } else if(value.length < 3) {
            setIsNotValidDestinatary(true)
            setErrorDestinataryMessage('El destinatario debe tener al menos 3 caracteres')
        } else {
            setIsNotValidDestinatary(false)
            setErrorDestinataryMessage('')
        }
    }
    

    return {destinatary, isNotValidDestinatary, errorDestinataryMessage, validateDestinatary}
}

export {useValidateDestinatary}