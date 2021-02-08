import { MusicFile } from "./MusicFile";

export default interface Playlist{
  id: string;
  name: string;
  songs: MusicFile[];
  description: string;
}