const loginCodes = {
    //C1 login correcto
    'C2': 'Usuario o Contraseña incorrecta',
    'C3': 'Tu usuario se encuentra bloqueado, hace click en "Olvidé mi contraseña" para recuperarla.',
    //C4 Cambio de contraseña
    'C5': 'El usuario ingresado es inexistente o se encuentra dado de baja.',
    'C6': 'El Usuario ingresado es inválido, recorda ingresar con tu usuario de Experta Seguros APP.',
    'C7': 'El Usuario ingresado no posee permisos para autenticarse en la aplicación.',
    'C8': 'Ha ocurrido un error, intenta nuevamente en unos minutos. Si persiste, comunicate con Experta Seguros.',
}

const passwordCodes = {
    'C3': 'Su usuario se encuentra bloqueado, comuníquese con Experta ART.',
    //C4 Cambio de contraseña
    'C5': 'Usuario inexistente en el sistema de Experta ART.',
    'C6': 'La contraseña debe contener al menos 2 números y una longitud mínima de 8 caracteres.',
    'C7': 'Usuario inválido, no posee permisos para autenticarse en la aplicación.',
    'C8': 'Ha ocurrido un error, pruebe nuevamente en unos minutos. Si persiste, comuniquese con Experta ART.',
    'C10': 'Su nueva contraseña debe ser distinta a la elegida durante los últimos 6 meses.',
    'C12': 'Su nueva contraseña debe ser distinta a las últimas 6 contraseñas elegidas.'
}


const permissions = {
    'siniestros': [1, 3, 7, 11, 12, 17, 18],
    'cuentaCorriente': [1, 5, 7, 12, 17, 18],
    'certificadoCobertura': [1, 4, 5, 7, 10, 12, 17, 18, "EMPLEADO.CERTIFICADOS"],
    'clausulaNr': [1, 4, 5, 7, 10, 12, 17, 18, "EMPLEADO.CERTIFICADOS"],
    'credenciales': [1, 4, 5, 7, 10, 12, 17, 18, "EMPLEADO.CREDENCIALES"],
    'contacto': [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18],
    'contratoAlicuotas': [1, 5, 7, 17, 18],
    'contratoImpresion': [1, 4, 5, 7, 8, 12, 17, 18, "CONTRATO.IMPRESION"],
    'my_art': [/* Only Affiliates */]
}

const viewer = {
    CLIENTE: 'CLIENTE',
    AFILIADO : 'AFILIADO'
}

export {loginCodes, permissions, viewer, passwordCodes}