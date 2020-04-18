import React, { useState, useEffect } from 'react';
import { Image, YellowBox, View, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import Dialog from 'react-native-dialog';
import { useNavigation } from '@react-navigation/native';

import { MaterialIcons, Feather } from '@expo/vector-icons';

YellowBox.ignoreWarnings([
  'componentWillUpdate has been renamed',
  'componentWillReceiveProps has been renamed',
  'source.uri'
]);

import {
  Container, ContainerTitle, NameMarket, FavButton, TextTitle, ContainerMarket, ContainerList, ContainerAdress, TextAdress,
  Adress, ContainerDropdown, ScheduleButton, TextBox, Content, ImageContainer, FavContainer, NoPosterContainer, NoPosterText
} from './styles';

import getDays from '../../../utils/getDays';
import getSchedules from '../../../utils/getSchedules';

import StatusBar from '../../../components/StatusBar';

import api from '../../../services/api';

export default function Shedule({ route }) {
  const navigation = useNavigation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [liked, setLiked] = useState(false);
  const [place, setPlace] = useState({
    name: "",
    photo_url: ""
  });
  const [address, setAdress] = useState({
    city: "",
    UF: "",
    burgh: "",
    street: "",
    num: ""
  });

  function MyDialog() {
    return (
      <View>
        <Dialog.Container visible={dialogVisible} >
          <Dialog.Title>Parabéns!</Dialog.Title>
          <Dialog.Description>
            Você foi agendado(a) com sucesso!
            </Dialog.Description>
          <Dialog.Button label="OK" onPress={() => { setDialogVisible(false) }} />
        </Dialog.Container>
      </View>
    )
  }

  useEffect(() => {
    async function getAPi() {
      const response = await api.get(`/company/find/${route.params.company_id}`);

      setPlace(response.data);
      setAdress(response.data.address);
    }
    getAPi();
  }, []);

  function handleLike() {
    setLiked(!liked);
  };

  async function booking() {
    const response = await api.post(`/booking/${place._id}`, {
      hour,
      day: date
    }, {
      headers: {
        user: route.params.user_id
      }
    });

    setDialogVisible(true);

    navigation.navigate('Ticket', { id: response.data._id });

  }

  return (
    <Container>
      <StatusBar />
      <MyDialog />
      <Content>
        <ImageContainer>
          {place.haveImage ?
            <Image source={{ uri: place.photo_url }} style={{ width: '100%', height: '100%' }} />
            :
            <NoPosterContainer>
              <Feather name="camera-off" color="#BEBEBE" size={80} />
            </NoPosterContainer>
          }
        </ImageContainer>
        <View  >

        </View>
        <ContainerMarket>
          <ContainerTitle>
            <NameMarket>
              <TextTitle>{place.name}</TextTitle>
            </NameMarket>
            <FavContainer>
              <FavButton activeOpacity={0.5} onPress={() => { handleLike() }}  >
                <MaterialIcons
                  name={liked ? "favorite" : "favorite-border"}
                  size={30}
                  color={liked ? "#FF0000" : "#D9D0E3"}
                />
              </FavButton>
            </FavContainer>
          </ContainerTitle>
          <ContainerAdress>
            <MaterialIcons name="home" size={20} />
            <Adress>
              <TextAdress>
                {address.city}, {address.UF}
              </TextAdress>
              <TextAdress>
                Bairro {address.burgh}, {address.street}, Número {address.num}
              </TextAdress>
            </Adress>
          </ContainerAdress>
          <ScrollView style={{ width: '100%' }} >
            <ContainerList>
              <ContainerDropdown>
                <Dropdown
                  label='Escolha o dia'
                  data={getDays()}
                  itemPadding={8}
                  fontSize={21}
                  baseColor={"#868686"}
                  containerStyle={({
                    borderRadius: 13,
                    height: 56,
                    backgroundColor: '#FFFFFF',
                    justifyContent: "center",
                    paddingHorizontal: 15,
                    marginTop: 20
                  })}
                  onChangeText={text => setDate(text)}
                  value={date}
                />
                <Dropdown
                  label='Escolha o horário'
                  data={getSchedules()}
                  itemPadding={8}
                  fontSize={21}
                  baseColor={"#868686"}
                  containerStyle={({
                    borderRadius: 13,
                    height: 56,
                    marginTop: 21,
                    backgroundColor: '#FFFFFF',
                    justifyContent: "center",
                    marginBottom: 30,
                    paddingHorizontal: 15
                  })}
                  onChangeText={text => setHour(text)}
                  value={hour}
                />
                <ScheduleButton activeOpacity={0.5} onPress={booking} >
                  <TextBox>
                    Agendar
               </TextBox>
                </ScheduleButton>
              </ContainerDropdown>
            </ContainerList>
          </ScrollView>
        </ContainerMarket>
      </Content>
    </Container>
  )
}