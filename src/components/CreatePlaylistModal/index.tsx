import React, { useCallback, useEffect, useRef, useState } from 'react';

import { TouchableNativeFeedback, Modal, Animated, StyleSheet, View , ToastAndroid} from 'react-native';
import { useSongs } from '../../hooks/songs';

import { ButtonContainer, ButtonText, CustomButton, ErrorMessage, ErrorMessageContainer, SearchBox, SearchBoxContainer, Title } from './styles';

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

  const animatedOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setErrorMessage('');
    setIsVisible(active);
    Animated.timing(animatedOpacity, {
      toValue: active ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
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
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClosePress}
      onDismiss={() => {
        setIsVisible(false);
        setErrorMessage('');
      }}
    >
      <Animated.View style={[styles.centeredView, {opacity: animatedOpacity}]}>
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
            <TouchableNativeFeedback onPress={handleClosePress}>
              <CustomButton>
                <ButtonText>
                  Fechar
                </ButtonText>
              </CustomButton>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={handleOkPress}>
              <CustomButton>
                <ButtonText>
                  Ok
                </ButtonText>
              </CustomButton>
            </TouchableNativeFeedback>
          </ButtonContainer>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(20,20,20,0.5)',
  },
  modalView: {
    backgroundColor: "#1a1a1a",
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
