import React, { useEffect, useState } from 'react';

import { Container, Title, Header, Content } from './styles';

import SortableList from 'react-native-sortable-list';
import IconFeather from 'react-native-vector-icons/Feather';

import { useSongs } from '../../hooks/songs';
interface QueueSong {
  artist: string;
  artwork: string; 
  id: number;
  title: string; 
  url: string;
}

/*

  Queue page currently in stand by...
  making tests to implement the queuePage with a SortableList (fun)

*/

const QueuePage: React.FC = () => {
  const [currentQueue, setCurrentQueue] = useState<QueueSong[]>([]);
 
  const { TrackPlayer } = useSongs();

  useEffect(() => {
    getQueue();
  }, []);

  async function getQueue(){
    const queue: QueueSong[] = await TrackPlayer.getQueue();
    console.log("queue: ",queue);
    setCurrentQueue(queue);
  }

  return (
    <Container>
      <Header>
        <Title>Fila de Músicas</Title>
      <IconFeather name="refresh-ccw" size={25} color='#fff' onPress={getQueue}/>
      </Header>
      <Content>
        {/* {
          currentQueue.length > 1
          // ? (
          //   <FlatList
          //     data={currentQueue}
          //     render={({song}) => {(
          //       <View>
          //         <Text>{song.title}</Text>
          //       </View>
          //     )
          //     }
          //   />
          )
          : null
        } */}
      </Content>
    </Container>
  );
};

export default QueuePage;
