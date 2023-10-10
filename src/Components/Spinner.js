import React from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'

const Spinner = () => {

  return (
    <View style={styles.container}>
      <ActivityIndicator size={70} color="#4db8e8"/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(70,88,129, 0.8)',
    justifyContent: 'center'
  }
})

export default Spinner
