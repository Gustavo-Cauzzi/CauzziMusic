import TrackPlayer from 'react-native-track-player';

module.exports = async function() {

  TrackPlayer.addEventListener('remote-play', () => {
    console.log("remote-play (play)")
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    console.log("remote-pause (pause)")
    TrackPlayer.pause()
  });

  TrackPlayer.addEventListener('remote-next', () => {
    console.log("remote-next (skip to next)")
    TrackPlayer.skipToNext()
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    console.log("remote-previous (skip to previous)")
    TrackPlayer.skipToPrevious()
  });
};