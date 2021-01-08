import TrackPlayer from 'react-native-track-player';

module.exports = async function() {

  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext()
  });

  TrackPlayer.addEventListener('remote-previous', async () => {
    const position = await TrackPlayer.getPosition();
    if(position <= 5){
      TrackPlayer.skipToPrevious()
    }else{
      TrackPlayer.seekTo(0);
    }
  });
};