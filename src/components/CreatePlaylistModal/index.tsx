import React, { useCallback, useEffect, useState } from 'react';

import { Alert, Modal, StyleSheet, Text, View , TouchableOpacity, ToastAndroid} from 'react-native';
import { RectButton, TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import { useSongs } from '../../hooks/songs';

import { ButtonContainer, ButtonText, Container, CustomButton, ErrorMessage, ErrorMessageContainer, ModalContainer, SearchBox, SearchBoxContainer, Title } from './styles';

interface MusicFile{
  id : number,
  title : string,
  author : string,
  album : string,
  genre : string,
  duration : number, // miliseconds
  cover :string,
  blur : string, //Will come null if createBLur is set to false
  path : string
}
interface CreatePlaylistModal {
  active: boolean;
  onClose?: () => void;
  songs?: MusicFile[];
}

const CreatePlaylistModal: React.FC<CreatePlaylistModal> = ({active, onClose, songs}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [textBoxValue, setTextBoxValue] = useState<String>('');
  const [errorMessage, setErrorMessage] = useState<String>('')
  const [isSearchBoxSelected, setIsSearchBoxSelected] = useState<boolean>(false);

  const { createPlaylist } = useSongs();

  useEffect(() => {
    setErrorMessage('');
    setIsVisible(active);
  }, [active]);

  const handleClosePress = useCallback(() => {
    setIsVisible(false);
    onClose && onClose();
  }, [onClose]);

  const handleOkPress = useCallback(() => {
    if(textBoxValue != ''){
      const success = createPlaylist(textBoxValue, songs ? songs : undefined);

      if(success){
        ToastAndroid.show('Playlist criada!',ToastAndroid.SHORT);
        setIsVisible(false);
        onClose && onClose();
      }else{
        setErrorMessage('Playlist com mesmo nome já existente!');
      }
    }else{
      setErrorMessage('Por favor, insira um nome para a playlist!');
    }
  }, [textBoxValue])

  return (
    <Container>
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClosePress}
    >
    
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Title>Criar playlist</Title>
          <SearchBoxContainer isActive={isSearchBoxSelected}>
            <SearchBox 
              autoCorrect={false}          
              onFocus={() => {setIsSearchBoxSelected(true)}}  
              onBlur={() => {setIsSearchBoxSelected(false)}}  
              placeholder={'Nome da Playlist...'}
              placeholderTextColor={'#888'}
              onChangeText={(newValue) => {
                setTextBoxValue(newValue)
              }}
            />
          </SearchBoxContainer>
          <ErrorMessageContainer>
            <ErrorMessage>
              {errorMessage ? errorMessage : null}
            </ErrorMessage>
          </ErrorMessageContainer>
          <ButtonContainer>
            <CustomButton>
              <TouchableOpacity onPress={handleClosePress} style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                <ButtonText>
                  Fechar
                </ButtonText>
              </TouchableOpacity>
            </CustomButton>
            <CustomButton>
              <TouchableOpacity onPress={handleOkPress} style={{flex: 1, flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                <ButtonText>
                  Ok
                </ButtonText>
              </TouchableOpacity>
            </CustomButton>
          </ButtonContainer>
        </View>
      </View>
    </Modal>
  </Container>

  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 10,
    marginTop: 10,
    height: 150,
    width: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default CreatePlaylistModal;
