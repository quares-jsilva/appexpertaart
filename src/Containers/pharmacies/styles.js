import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: 'transparent',
    },
    positionButton: {
        position: 'absolute',
        top: 10,
        left: '5%',
        right: '5%',
        alignSelf: 'flex-end'
    },
    positionGpsButton: {
        position: 'absolute',
        top: 70,
        right: '5%',
        alignSelf: 'flex-end'
    },
    positionCard: {
        position: 'absolute',
        bottom: 10,
        height: '15%',
        width: '90%',
        alignSelf: 'center'
    },
    phoneBorder: {
        borderLeftColor: 'grey', 
        borderLeftWidth: 1
    },
    placeholderSize: {
        fontSize: 12
    }
});

export default styles