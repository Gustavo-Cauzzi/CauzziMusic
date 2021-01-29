import React from 'react';
import { View } from 'react-native';
import { Checkbox } from 'react-native-paper';
import IconAntDesing from 'react-native-vector-icons/AntDesign';
import { useSongs } from '../../hooks/songs';

import { 
  ConfigurationContainer, 
  ConfigurationDetails, 
  ConfigurationInfo, 
  ConfigurationTitle, 
  Container, 
  Header, 
  Title 
} from './styles';

interface FilterConfigurationPageProps {
  navigation?: any
}

const FilterConfigurationPage: React.FC<FilterConfigurationPageProps> = ({ navigation }) => {

  const { hideFilteredSongs, changeHideFilteredSongs, ignoreAudios, changeIgnoreAudios } = useSongs();

  return (
    <Container>
      <Header>
        <IconAntDesing name="arrowleft" size={20} color="#fff" onPress={() => {navigation.goBack()}}/>
        <Title>Configurações do Filtro</Title>
        <View style={{width: 20}}></View>
      </Header>
      <ConfigurationContainer>
        <ConfigurationInfo>
          <ConfigurationTitle>
            Ocultar Músicas Filtradas
          </ConfigurationTitle>
          <ConfigurationDetails>
            Todas as músicas filtradas serão ocultas da lista principal de músicas.
          </ConfigurationDetails>
        </ConfigurationInfo>
        <Checkbox 
          status={hideFilteredSongs ? 'checked' : 'unchecked'}
          onPress={() => {
            changeHideFilteredSongs(!hideFilteredSongs);
          }}
          color={'#fff'}
          uncheckedColor={'#fff'}
        />
      </ConfigurationContainer>
      <ConfigurationContainer>
        <ConfigurationInfo>
          <ConfigurationTitle>
            Ignorar Aúdios de Mensagens
          </ConfigurationTitle>
          <ConfigurationDetails>
            O aplicativo irá ignorar arquivos de aúdios salvos no celular vindo de aplicativos de mensagens.
          </ConfigurationDetails>
        </ConfigurationInfo>
        <Checkbox 
          status={ignoreAudios ? 'checked' : 'unchecked'}
          onPress={() => {
            changeIgnoreAudios(!ignoreAudios);
          }}
          color={'#fff'}
          uncheckedColor={'#fff'}
        />
      </ConfigurationContainer>
    </Container>
  );
};

export default FilterConfigurationPage;
