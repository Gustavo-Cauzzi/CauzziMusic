import React, { useCallback, useEffect, useRef, useState } from 'react';

import { TouchableNativeFeedback, Modal, Animated, StyleSheet, View , ToastAndroid} from 'react-native';
import Playlist from '../../@types/iPlaylist';
import { useSongs } from '../../hooks/songs';

import { 
  ButtonContainer, 
  ButtonText, 
  CustomButton, 
  ErrorMessage, 
  ErrorMessageContainer, 
  FieldTitle, 
  SearchBox, 
  SearchBoxContainer, 
  Title 
} from './styles';

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
interface EditPlaylistModalProps {
  active: boolean;
  playlist: Playlist;
  onClose?: () => void;
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({active, playlist: currentPlaylist, onClose}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Playlist>({description: '', name: '', id: '', songs: []});
  const [textBoxNameValue, setTextBoxNameValue] = useState('');
  const [textBoxDescriptionValue, setTextBoxDescriptionValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<String>('')
  const [isNameSearchBoxSelected, setIsNameSearchBoxSelected] = useState<boolean>(false);
  const [isDescriptionSearchBoxSelected, setIsDescriptionSearchBoxSelected] = useState<boolean>(false);

  const { editPlaylistInfo } = useSongs();

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

  useEffect(() => {
    setPlaylist(currentPlaylist);
    setTextBoxNameValue(currentPlaylist.name);
    setTextBoxDescriptionValue(currentPlaylist.description);
  }, [currentPlaylist]);

  const handleClosePress = useCallback(() => {
    setIsVisible(false);
    setErrorMessage('');
    setIsNameSearchBoxSelected(false);
    setIsDescriptionSearchBoxSelected(false);
    setTextBoxNameValue(currentPlaylist.name);
    setTextBoxDescriptionValue(currentPlaylist.description);
    onClose && onClose();
  }, [onClose]);

  const handleOkPress = useCallback(() => {
    editPlaylistInfo(playlist.id, {description: textBoxDescriptionValue, name: textBoxNameValue});
    setIsVisible(false);
    onClose && onClose();
  }, [editPlaylistInfo, textBoxDescriptionValue, textBoxNameValue, playlist])

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
          <Title>Editar Playlist</Title>
          <FieldTitle>
            Nome da Playlist
          </FieldTitle>
          <SearchBoxContainer isActive={isNameSearchBoxSelected} style={{height: 40}}>
            <SearchBox 
              autoCorrect={false}          
              value={textBoxNameValue}
              onFocus={() => {setIsNameSearchBoxSelected(true)}}  
              onBlur={() => {setIsNameSearchBoxSelected(false)}}  
              placeholder={'Nome da Playlist...'}
              placeholderTextColor={'#888'}
              onChangeText={(newValue) => {
                setTextBoxNameValue(newValue)
              }}
            />
          </SearchBoxContainer>
          <FieldTitle style={{marginTop: 30}}>
            Descrição da Playlist
          </FieldTitle>
          <SearchBoxContainer isActive={isDescriptionSearchBoxSelected}>
            <SearchBox 
              style={{flex: 1}}
              autoCorrect={false}          
              multiline={true}
              value={textBoxDescriptionValue}
              onFocus={() => {setIsDescriptionSearchBoxSelected(true)}}  
              onBlur={() => {setIsDescriptionSearchBoxSelected(false)}}  
              placeholder={'...'}
              placeholderTextColor={'#888'}
              onChangeText={(newValue) => {
                if(newValue.length >= 275){
                  setErrorMessage('A descrição só pode ter entre 0 e 275 caracteres');
                }else{
                  setErrorMessage('');
                  setTextBoxDescriptionValue(newValue)
                }
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
    height: 320,
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

export default EditPlaylistModal;
