import React from 'react';
import { SongContainer, SongAlbumCover, SongAlbumCoverPlaceHolder, SongInfo, SongName, ArtistName } from '../../pages/SongList/styles';
import IconFontisto from 'react-native-vector-icons/Fontisto';

interface props {
  song: any
}

export default class ListComponent extends React.PureComponent<props>{
  state = {
    song: this.props.song
  }

  render(){
    return (
      <SongContainer key={this.state.song.id} onPress={() => {}}>
      {this.state.song.cover 
        ? <SongAlbumCover source={{uri: `${this.state.song.cover}`}}/>
        : (
          <SongAlbumCoverPlaceHolder>
            <IconFontisto name="music-note" color="#fff" size={20}/>    
          </SongAlbumCoverPlaceHolder>
        )
      }
      <SongInfo>
        <SongName>{this.state.song.title}</SongName>
        <ArtistName>{this.state.song.author != '<unknown>' ? this.state.song.author : 'Desconhecido'}</ArtistName>
      </SongInfo>
      {/* <IconEntypo 
        name="dots-three-vertical" 
        size={20} 
        color="#bbb" 
        style={{position: 'absolute', right: 10}}
        onPress={() => {<PopupMenu />}}
      /> */}
    </SongContainer>
    )
  }
}