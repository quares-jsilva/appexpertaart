import React, { useEffect, useState, useRef } from 'react'
import { PermissionsAndroid, Platform, Linking, Image } from "react-native"
import { useTheme } from '@/Theme'
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import Geolocation from 'react-native-geolocation-service';
import { View } from 'react-native';
import styles from './styles'
import { Icon, SearchBar } from 'react-native-elements'
import { Text } from 'react-native';
import Analytics from '../../libs/analytics'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux'
import { getAll, getByName } from '@/Store/Pharmacy'
import { openUrl, makeCall } from '@/libs/deepLinks'

const PharmaciesContainer = () => {

    const { Layout, Gutters, Images, Common, Fonts } = useTheme()
    const mapRef = useRef()
    const expertaLocation = {latitude: -34.54863928286167, longitude: -58.45546393920486, latitudeDelta: 0.009, longitudeDelta: 0.009}
    const [myPosition, setMyPosition] = useState(expertaLocation)
    const [region, setRegion] = useState(expertaLocation);
    const [showSearch, setShowSearch] = useState(false);
    const [showDetails, setDetails] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState({});
    const [searchValue, setSearchValue] = useState('')
    const { pharmacies, loading } = useSelector((state) => state.pharmacy )
    const { data, pwid } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {
        Analytics.logScreen('Farmacias', 'PharmaciesContainer')
        requestPermissions()
    }, []);

    const requestPermissions = async () => {
        if (Platform.OS === 'ios') {
            const granted = await Geolocation.requestAuthorization("whenInUse");
            if(granted === "granted") {
                getLocation()
            } else {
                findPharmacies(expertaLocation.latitude, expertaLocation.longitude)
            }
        }
        
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getLocation()
            } else {
                findPharmacies(expertaLocation.latitude, expertaLocation.longitude)
            }
        }
    }

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const newPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude, latitudeDelta: 0.009,longitudeDelta: 0.009}
                setMyPosition(newPosition)
                setRegion(newPosition)
                mapRef && mapRef.current && mapRef.current.animateToRegion(newPosition)
                findPharmacies(newPosition.latitude, newPosition.longitude)
            },
            (error) => {
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const changeSearch = () => {
        let searchState = showSearch
        setShowSearch(!searchState)
    }

    const updateSearch = (search) => {
        setSearchValue(search)
        findPharmacies(myPosition.latitude, myPosition.longitude)
    }

    const saveDetail = (marker) => {
        Analytics.logEvent('VerDetalleDeFarmacia' + marker.destacada ? "destacada" : "", 'PharmaciesContainer')
        setDetails(true)
        setSelectedMarker({
            destacada: marker.destacada,
            direccion: marker.direccion,
            latitud: marker.latitud,
            longitud: marker.longitud,
            nombre: marker.nombre,
            telefono: marker.telefono
        })
    }

    const findPharmacies = (lat, lon, radio = 10) => {
        if(searchValue && searchValue !== '') {
            dispatch(getByName(
                {
                    name: searchValue,
                    dni: data.documento, 
                    user: pwid
                })
            )
        }else{
            dispatch(getAll({
                latitud: lat, 
                longitud: lon, 
                radio, 
                dni: data.documento, 
                usuario: pwid
            }))
        }
    }

    const calculateDistance = (pointA, pointB) => {

        // http://www.movable-type.co.uk/scripts/latlong.html
        const lat1 = pointA.latitud;
        const lon1 = pointA.longitud;
      
        const lat2 = pointB.latitud;
        const lon2 = pointB.longitud;
      
        const R = 6371e3; // earth radius in meters
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);
      
        const a = (Math.sin(Δφ / 2) * Math.sin(Δφ / 2)) +
                  ((Math.cos(φ1) * Math.cos(φ2)) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2)));
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
        const distance = R * c;
        return distance; // in meters
      }

    const featuredNearby = (pharmacy, featuredList = []) => {
        if(featuredList.length > 0){
            let found = featuredList.find(featured => {
                if(calculateDistance(pharmacy, featured) < 1000){ //1000 = 1km
                    return true;
                  }  
            })
            return found === undefined ? false : true
        } else {
          return false;
        }
        
    }

    const renderMarker = () => {
        if(pharmacies.length > 0) {
            //Featured Pharmacy Search
            let featuredList = pharmacies.filter(pharmacy => pharmacy.destacada)

           return pharmacies.map((marker, index) => {
                if(!marker.destacada && !featuredNearby(marker, featuredList)) {
                    return <Marker
                        key={index}
                        image={Images['pharmaMark']}
                        coordinate={{latitude: Number(marker.latitud), longitude: Number(marker.longitud)}}
                        onPress={ () => saveDetail(marker)}
                    /> 
                }else{
                    return <Marker
                        key={index}
                        image={Images['pharmaMarkDes']}
                        coordinate={{latitude: Number(marker.latitud), longitude: Number(marker.longitud)}}
                        onPress={() => saveDetail(marker)}
                    />
                }
            })
        }
    }

    return (
        <View style={Layout.fill}>
            <MapView
            customMapStyle={[
                {
                  featureType: "administrative",
                  elementType: "geometry",
                  stylers: [
                  {
                      visibility: "off"
                  }
                  ]
                },
                {
                  featureType: "poi",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "road",
                  elementType: "labels.icon",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "transit",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                }
              ]}
            radius={40}
                ref={mapRef}
                style={Layout.fill}
                initialRegion={region}
                onRegionChangeComplete={({latitude, longitude}) => findPharmacies(latitude, longitude, 60)}
            >
                <Marker
                    coordinate={myPosition}
                    title={'Mi ubicación'}
                    image={Images['myLocation']}
                />
                { renderMarker() }
            </MapView>
            <View style={[Layout.fill, Layout.row, styles.positionButton]}>
                    <View style={[Layout.fill, Layout.fullWidth, Gutters.smallHPadding]}>
                        {   showSearch &&
                            <SearchBar
                                lightTheme={true}
                                containerStyle={styles.searchBar}
                                inputContainerStyle={Common.card}
                                value={searchValue}
                                style={[Fonts.sourceSansRegular, {fontWeight: 'normal'}]}
                                placeholder={'Buscar por farmacia o prestador'}
                                inputStyle={styles.placeholderSize}
                                lightTheme={true}
                                onChangeText={updateSearch}
                            />
                        }
                    </View>
                    <View style={[Common.circle, Layout.center]}>
                        <Icon
                            type="MaterialIcons"
                            name='search'
                            size={35}
                            color='gray'
                            onPress={changeSearch}
                        />
                    </View>
            </View>
            <View style={styles.positionGpsButton}>
                <View style={[Common.circle, Layout.center, Gutters.smallTMargin]}>
                    <Icon
                        type="MaterialIcons"
                        name='gps-fixed'
                        size={35}
                        color='gray'
                        onPress={getLocation}
                    />
                </View>
            </View>
            {   showDetails &&
                <View style={[Layout.fill ,styles.positionCard, Common.card, {flexDirection:'row', justifyContent: 'flex-start'}]}>
                    
                    <View style={[Layout.fill, Layout.row, Layout.justifyContentCenter, {alignItems: 'center'}]}>
                        <View style={[Layout.fill, Gutters.smallLMargin]}>
                            <Text style={Fonts.sourceSansSemibold}>{selectedMarker.nombre}</Text>
                            <Text style={Fonts.sourceSansLight}>{selectedMarker.direccion}</Text>
                            {   
                                selectedMarker.telefono &&
                                <Text style={Fonts.sourceSansLight}>{selectedMarker.telefono}</Text>
                            }
                        </View>
                        { selectedMarker.telefono && 
                            <View style={[Gutters.smallLPadding]}>
                                <Icon
                                    type="MaterialIcons"
                                    name='call'
                                    size={35}
                                    color='gray'
                                    onPress={() => {
                                        Analytics.logEvent('LlamarAFarmacia', 'PharmaciesContainer')
                                        makeCall(selectedMarker.telefono)
                                    }}
                                />
                            </View>
                        }
                        
                    </View>
                    <View style={[Gutters.smallPadding, {alignItems: 'flex-end', justifyContent: 'flex-start'}]}>
                        <TouchableOpacity onPress={()=> {setDetails(false)}}>
                            <Image 
                                style={{height: 30, width: 30}} 
                                resizeMode={'contain'} 
                                source={Images.back}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    )
}

export default PharmaciesContainer