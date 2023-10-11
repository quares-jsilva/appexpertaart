import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Theme'
import { Image } from "react-native"

import {
    DashboardARTContainer,
    ContractListContainer, 
    ContractDetailContainer, 
    CoverageDetailContainer, 
    ClaimListContainer, 
    ClaimDetailContainer,
    TreatmentDetailContainer,
    NonRepetitionDetailContainer,
    LoginContainer,
    RecoverPasswordContainer,
    RegisterStepOneContainer,
    RegisterStepTwoContainer,
    HelpContainer,
    TermsAndConditionsContainer,
    CheckingAccountContainer,
    ReferentListContainer,
    ReferentEditContainer,
    MyArtContainer,
    MyCardContainer,
    CredentialsContainer,
    PharmaciesContainer,
    FrequentQuestionsContainer,
    ProblemReportContainer,
    PdfVisualizerContainer,
    LoginEditUserContainer,
    MyTurnsContainer,
    EmployeeSearchContainer,
    ChangePasswordContainer,
    InitialScreenContainer,
    MyDataContainer,
    DashboardContainer
} from '@/Containers'

const Stack = createStackNavigator()
let ProfileNavigator = require('@/Navigators/Profile').default
let NotificationsNavigator = require('@/Navigators/Notifications').default

const DashboardNavigator = () => {

    const { isAuthenticated } = useSelector((state) => state.auth )
    const { homeRoute } = useSelector((state) => state.user )
    const { Images } = useTheme()

    return (
        <Stack.Navigator 
        screenOptions={{
            headerBackTitleVisible: false,
            headerMode: 'screen'
        }}>
            { isAuthenticated && (
                    <>
                        {homeRoute === 'Dashboard' && <Stack.Screen name="Dashboard" component={DashboardContainer} options={{headerLeft: () => { return null }, headerTitle: (props) => (<Image style={{width: 200, height: 200}} resizeMode={'contain'} source={Images['ARTIsologo']}/>), headerTitleAlign: 'center', headerStyle: {height: 100} }}/>}
                        <Stack.Screen name="DashboardArt" component={DashboardARTContainer} 
                        options={{
                            ...(homeRoute !== 'Dashboard' && {headerLeft: () => { return null }}),
                            title: 'Seguro de ART', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="ContractList" component={ContractListContainer} options={{title: 'Selección de póliza', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="ContractDetail" component={ContractDetailContainer} options={{title: 'Póliza', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="CoverageDetail" component={CoverageDetailContainer} options={{title: 'Cobertura', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="ClaimList" component={ClaimListContainer} options={{title: 'Lista de siniestros', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="ClaimDetail" component={ClaimDetailContainer} options={{title: 'Siniestro', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="TreatmentDetail" component={TreatmentDetailContainer} options={{title: 'Siniestro', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="NonRepetitionDetail" component={NonRepetitionDetailContainer} options={{title: 'Cláusula de no repetición', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="PdfVisualizer" component={PdfVisualizerContainer} options={{title: 'Documentación', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="CheckingAccount" component={CheckingAccountContainer} options={{title: 'Cuenta corriente', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="ReferentList" component={ReferentListContainer} options={{title: 'Referentes', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="ReferentEdit" component={ReferentEditContainer} options={{title: 'Nuevo referente', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="MyArt" component={MyArtContainer} options={{title: 'Mi ART', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="MyCard" component={MyCardContainer} options={{title: 'Mi tarjeta', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="Credentials" component={CredentialsContainer} options={{title: 'Credenciales', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="Pharmacies" component={PharmaciesContainer} options={{title: 'Farmacias y Prestadores', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="MyTurns" component={MyTurnsContainer} options={{title: 'Mis Turnos', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="EmployeeSearch" component={EmployeeSearchContainer} options={{title: 'Selección de empleados', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
                        <Stack.Screen name="InitialScreen" component={InitialScreenContainer} options={{headerShown: false}} />
                        <Stack.Screen name="Profile" component={ProfileNavigator} options={{headerShown: false}}/>
                        <Stack.Screen name="MyData" component={MyDataContainer} options={{title: 'Mis Datos', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
                        <Stack.Screen name="Notificaciones" component={NotificationsNavigator} options={{headerShown: false}}/>
                    </>
                )
            }
            <Stack.Screen name="Login" component={LoginContainer} options={{headerShown: false}}/>
            <Stack.Screen name="RecoverPassword" component={RecoverPasswordContainer} options={{headerShown: false}}/>
            <Stack.Screen name="RegisterStepOne" component={RegisterStepOneContainer} options={{headerShown: false}}/>
            <Stack.Screen name="RegisterStepTwo" component={RegisterStepTwoContainer} options={{headerShown: false}}/>
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsContainer} options={{headerShown: false}}/>
            <Stack.Screen name="Help" component={HelpContainer} options={{title: 'Ayuda', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
            <Stack.Screen name="ProblemReport" component={ProblemReportContainer} options={{title: 'Reporte de problemas', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
            <Stack.Screen name="FrequentQuestions" component={FrequentQuestionsContainer} options={{title: 'Preguntas Frecuentes', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordContainer} options={{title: 'Cambiar contraseña', headerTitleAlign: 'center', headerTitleStyle: {fontFamily: 'SourceSansPro-Light'}}}/>
            <Stack.Screen name="LoginEditUser" component={LoginEditUserContainer} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

export default DashboardNavigator