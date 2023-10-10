
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ContractApi from '@/Services/Contract/Contract'

export const getContractsClient = createAsyncThunk(
  'contract/getContractsClient',
  async (params, thunkApi) => {
    try {
      const response = await ContractApi.getContractsClient(params)
      return response
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

export const getContractDetail = createAsyncThunk(
  'contract/getContractDetail',
  async (params, thunkApi) => {
    try {
      const response = await ContractApi.getContractDetail(params)
      const resCurrentAccount = await ContractApi.getCurrentAccountDetail(params)
      const resEjecutivo = await ContractApi.getEjecutivo(params)
      const resPermisos = await ContractApi.getPermisos(params)

      return {...response, data: {...response.data, ...resCurrentAccount.data, ejecutivo: {...resEjecutivo.data}, permiso: {...resPermisos.data}}}
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)


export const getContractPrintUrl = createAsyncThunk(
  'contract/getContractPrintUrl',
  async (params, thunkApi) => {
    try {
      let response = await ContractApi.getContractPrintUrl(params)
      return response
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

export const getCertificatePrintUrl = createAsyncThunk(
  'contract/getCertificatePrintUrl',
  async (params, thunkApi) => {
    try {
      let response = await ContractApi.getCertificatePrintUrl(params)
      return response
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

export const getNonRepetitionPrintUrl = createAsyncThunk(
  'contract/getNonRepetitionPrintUrl',
  async (params, thunkApi) => {
    try {
      let response = await ContractApi.getNonRepetitionPrintUrl(params)
      return response
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

export const getEmployees = createAsyncThunk(
  'contract/getEmployees',
  async (params, thunkApi) => {
    try {
      let response = await ContractApi.getEmployees(params)
      return response
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

export const getAffiliatedInsurance = createAsyncThunk(
  'contract/getAffiliatedInsurance',
  async (params, thunkApi) => {
    try {
      let response = await ContractApi.getAffiliatedInsurance(params)
      return response
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
    
  }
)

const initialState = {
  clientContracts: [],
  affiliatedContracts: [],
  clientContractSelected: {},
  affiliatedContractSelected: {},
  contractDetail: {},
  contractBalance: {},
  employees: null,
  selectedEmployees: [],
  printUrl: null,
  status: null,
  message: null,
  error: null,
  loading: false,
  clientContractsCompleted: false,
  affiliatedContractsCompleted: false
}

// Then, handle actions in your reducers:
const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setClientContractSelected: (state, action) => {
      state.clientContractSelected = action.payload
    },
    setAffiliatedContractSelected: (state, action) => {
      state.affiliatedContractSelected = action.payload
    },
    resetPrintUrl: (state, action) => {
      state.printUrl = null
      state.status = null
      state.message = null
      state.loading = false
    },
    updateEmployee: (state, action) => {
      let index = state.selectedEmployees.findIndex(employee => employee.cuil === action.payload.cuil)
      if(index === -1) {
        state.selectedEmployees.push(action.payload)
      } else {
        state.selectedEmployees.splice(index, 1)
      }
    },
  },
  extraReducers: {
    'help/resetStatus': (state, action) => {
      state.status = null
      state.message = null
      state.error = null
    },
    'auth/logout': () => initialState,
    'auth/login/fulfilled': (state, action) => {
      return initialState
    },

    [getContractsClient.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
        state.clientContractsCompleted = false
      }
    },
    
    [getContractsClient.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.clientContracts = action.payload.data || []
        if(state.clientContracts.length === 1) {
          const [selected] = action.payload.data
          state.clientContractSelected = {
            nro_contrato: selected.numeroContrato,
            razon_social: selected.razonSocial,
            cuit: selected.cuit,
            tipoContrato: selected.tipoContrato
          }
        }else{
          state.clientContractSelected = {}
        }

        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
      state.clientContractsCompleted = true
    },
    [getContractsClient.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
      state.clientContractsCompleted = true
    },

    [getContractDetail.pending]: (state, action) => {
      if (state.loading === false) {
        state.loading = true
      }
    },
    [getContractDetail.fulfilled]: (state, action) => {
      if (state.loading === true) {
        const {
          ciiu,
          fechaInicioVigencia,
          localidad,
          provincia,
          domicilioCalle,
          domicilioNumero,
          domicilioPiso,
          domicilioDepto,
          cuentaCorrienteRGDTO,
          cuentaCorrientePCPDTO,
          alicuotaFija,
          alicuotaVariable,
          ciiuDescripcion,
          ejecutivo,
          tipoContrato, 
          permiso
        } = action.payload.data
        state.contractDetail = {
          permiso: permiso.permisos,
          vigencia_desde: fechaInicioVigencia,
          ejecutivo: ejecutivo[0] ? ejecutivo[0].ejecutivoComercialNombre : '',
          ciiu_codigo: ciiu ? ciiu : '',
          tipoContrato: tipoContrato,
          ciiu_descripcion: ciiuDescripcion ? ciiuDescripcion : '',
          domicilio_legal: (domicilioCalle ? (domicilioCalle + ', ') : '') + 
                           (domicilioNumero ? ('N° ' + domicilioNumero + ', ') : '') +
                           (domicilioPiso ? ('Piso ' + domicilioPiso + ', ') : '') + 
                           (domicilioDepto ? ('Dpto ' + domicilioDepto + ', ') : '') + 
                           (localidad ? localidad : '') + ', ' + 
                           (provincia ? provincia : ''),
          alicuota_fija: alicuotaFija,
          alicuota_variable: alicuotaVariable,
          capitas: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? cuentaCorrienteRGDTO.capitas : '0') : (cuentaCorrientePCPDTO ? cuentaCorrientePCPDTO.capitas : '0'),
          saldo_deudor: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? (cuentaCorrienteRGDTO.montoSaldoDeudor ? cuentaCorrienteRGDTO.montoSaldoDeudor : '0') : '0') : (cuentaCorrientePCPDTO ? (cuentaCorrientePCPDTO.montoSaldoDeudor ? cuentaCorrientePCPDTO.montoSaldoDeudor : '0') : '0') ,
          leyenda_saldo_deudor: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? cuentaCorrienteRGDTO.leyendaSaldoDeudor : '') : (cuentaCorrientePCPDTO ? cuentaCorrientePCPDTO.leyendaSaldoDeudor : ''),
          intereses: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? cuentaCorrienteRGDTO.intereses : '0') : (cuentaCorrientePCPDTO ? cuentaCorrientePCPDTO.intereses : '0'),
          morosidad: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? cuentaCorrienteRGDTO.morosidad : '0') : (cuentaCorrientePCPDTO ? cuentaCorrientePCPDTO.morosidad : '0'),
          gestionCobranza: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? cuentaCorrienteRGDTO.gestionCobranza : '') : (cuentaCorrientePCPDTO ? cuentaCorrientePCPDTO.gestionCobranza : ''),
          periodosAdeudados: (tipoContrato === 'REGIMEN_GENERAL' || tipoContrato === 'MIXTO') ? (cuentaCorrienteRGDTO ? cuentaCorrienteRGDTO.periodosAdeudados : '0') : (cuentaCorrientePCPDTO ? cuentaCorrientePCPDTO.periodosAdeudados : '0'),
        }
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },
    [getContractDetail.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },

    [getContractPrintUrl.pending]: (state, action) => {
      if (state.loading === false) {
        state.status = null
        state.message = null
        state.printUrl = null
        state.loading = true
      }
    },
    [getContractPrintUrl.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.printUrl = action.payload.data
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },
    [getContractPrintUrl.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.printUrl = null
        state.loading = false
      }
    },
    [getCertificatePrintUrl.pending]: (state, action) => {
      if (state.loading === false) {
        state.status = null
        state.message = null
        state.loading = true
        state.printUrl = null
      }
    },
    [getCertificatePrintUrl.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.printUrl = action.payload.data
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },
    [getCertificatePrintUrl.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.printUrl = null
        state.loading = false
      }
    },

    [getNonRepetitionPrintUrl.pending]: (state, action) => {
      if (state.loading === false) {
        state.status = null
        state.message = null
        state.loading = true
        state.printUrl = null
      }
    },
    [getNonRepetitionPrintUrl.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.printUrl = action.payload.data
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },
    [getNonRepetitionPrintUrl.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.printUrl = null
        state.loading = false
      }
    },

    [getEmployees.pending]: (state, action) => {
      if (state.loading === false) {
        state.status = null
        state.message = null
        state.loading = true
      }
    },
    [getEmployees.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.employees = action.payload.data.ac_listado_empleado.ac_listado_empleado_row
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },
    [getEmployees.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
    },

    [getAffiliatedInsurance.pending]: (state, action) => {
      if (state.loading === false) {
        state.status = null
        state.message = null
        state.loading = true
        state.affiliatedContractsCompleted = false
      }
    },
    [getAffiliatedInsurance.fulfilled]: (state, action) => {
      if (state.loading === true) {
        state.affiliatedContracts = action.payload.data && action.payload.data.map( contrato => (
            {
                razon_social: contrato.razonSocialPoliza,
                nro_contrato: contrato.numeroPoliza,
                cuit: contrato.cuitPoliza
            }
        )) || {}

        if(state.affiliatedContracts.length === 1) {
          const [first] = state.affiliatedContracts
          state.affiliatedContractSelected = first
        }else{
          state.affiliatedContractSelected = {}
        }
        state.status = action.payload.status
        state.loading = false
      }
      state.affiliatedContractsCompleted = true
    },
    [getAffiliatedInsurance.rejected]: (state, action) => {
      if (state.loading === true) {
        state.error = action.payload.error
        state.status = action.payload.status
        state.message = action.payload.message
        state.loading = false
      }
      state.affiliatedContractsCompleted = true
    },

  }
})

export const { 
    setClientContractSelected, 
    setAffiliatedContractSelected,
    updateEmployee,
    resetPrintUrl
} = contractSlice.actions
export default contractSlice.reducer