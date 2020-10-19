import {
    PositionalAudio,
    AudioLoader,
    Audio
  } from "three";

let audioLoader = new AudioLoader();
export function asyncLoadAudio(audioListener, path) {
    return new Promise((resolve, reject) => {
        let sound = new PositionalAudio( audioListener );
        audioLoader.load( path, ( buffer ) => {
            sound.setBuffer( buffer );
            // sound.setRefDistance( 20 );
            // sound.play();
            resolve(sound);
        } );
    });
}