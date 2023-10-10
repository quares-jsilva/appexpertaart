import React from 'react'
import { StyleSheet } from 'react-native'
import { Pagination } from 'react-native-snap-carousel';

const PaginationDots = (props) => {

  return (
    <Pagination
        dotsLength={props.length}
        activeDotIndex={props.index}
        dotStyle={{
            width: 7,
            height: 7,
            borderRadius: 5,
            backgroundColor: '#009bde'
        }}
        inactiveDotStyle={{
            // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={{marginVertical: -30}}
    />
  )

}

export default PaginationDots