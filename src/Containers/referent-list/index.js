// React
import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';

// Libraries
import { ListItem, SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Analytics from '../../libs/analytics';

// Components
import Loading from './loading';
import MenuButton from '../../Components/MenuButton';

// Hooks
import { useReferents } from '@/Hooks/useReferents';

// Styles and Themes
import { useTheme } from '@/Theme';
import styles from './styles';

const ReferentListContainer = (param) => {
  const { Common, Fonts, Gutters, Layout, Images } = useTheme();
  const navigation = useNavigation();
  const [filterText, setFilterText] = useState('');
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(11);
  const { contractSelected, update } = param.route.params || {};
  const { loading, referents } = useReferents({ filterText, contractSelected });

  useEffect(() => {
    Analytics.logScreen('Lista de Referente', 'ReferenteListContainer');
  }, []);

  const loadMore = () => {
    /*
        if(!lastContact) {
            setFrom(from + 10)
            setTo(to + 10)
        }*/
  };

  const updateSearch = (search) => {
    setFilterText(search);
  };

  useEffect(() => {
    if (!!update) {
      setFilterText('');
    }
  }, [update]);

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ReferentEdit', {
          referentId: item.id,
          contractSelected: contractSelected,
        })
      }
    >
      <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title style={[Fonts.sourceSansSemibold]}>
            {item.nombre}
          </ListItem.Title>
          <ListItem.Subtitle style={Fonts.sourceSansLight}>
            {item.email}
          </ListItem.Subtitle>
          {item.telefonos && item.telefonos.length > 0 && (
            <ListItem.Subtitle style={Fonts.sourceSansLight}>
              {item.telefonos[0].prefijo + ' - ' + item.telefonos[0].numero}
            </ListItem.Subtitle>
          )}
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <View style={[Layout.fullWidth]}>
        <SearchBar
          placeholder='Buscar referente'
          value={filterText}
          style={[Fonts.sourceSansRegular, { fontWeight: 'normal' }]}
          lightTheme={true}
          onChangeText={updateSearch}
        />
      </View>
      <View style={[Layout.fill, Layout.fullWidth]}>
        {loading ? (
          <Loading />
        ) : referents?.length === 0 ? (
          <View
            style={[
              Common.card,
              Gutters.smallMargin,
              Gutters.smallPadding,
              { borderRadius: 80 },
            ]}
          >
            <Text
              style={[
                Fonts.sourceSansSemibold,
                Gutters.smallPadding,
                { textAlign: 'center' },
              ]}
            >
              No encontramos contactos para mostrar
            </Text>
          </View>
        ) : (
          <FlatList
            keyExtractor={keyExtractor}
            data={referents}
            renderItem={renderItem}
            onEndReached={() => loadMore()}
            onEndReachedThreshold={1}
          />
        )}
      </View>
      <View style={[styles.buttonPosition, Gutters.smallRPadding]}>
        <MenuButton
          imageName='addContact'
          bottomText=''
          action={() => {
            navigation.navigate('ReferentEdit', {
              contractSelected: contractSelected,
            });
          }}
        />
      </View>
    </View>
  );
};

export default ReferentListContainer;
