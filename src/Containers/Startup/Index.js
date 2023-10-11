import React, { useCallback, useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { useTheme } from '@/Theme'
import { useDispatch } from 'react-redux'
import InitStartup from '@/Store/Startup/Init'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'

const IndexStartupContainer = () => {
  const { Layout, Gutters, Fonts } = useTheme()
 
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const initStartupAction = useCallback(async () => await dispatch(InitStartup.action()), [dispatch])

  useEffect(() => {
    initStartupAction()
  }, [])

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.regularVMargin]} />
      <Text style={Fonts.textCenter}>{t('welcome')}</Text>
    </View>
  )
}

export default IndexStartupContainer
