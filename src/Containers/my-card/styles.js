import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    imageSize: {
        width: 420,
        height: 150
    },
    logoSize: {
        width: 300,
        height: 200,
    },
    rotateCard: {
        transform: [{rotate: '90deg'}]
    },
    rotateLogo: {
        position: 'absolute',
        transform: [{rotate: '270deg'}],
    }
});

export default styles