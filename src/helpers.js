import {
  Vector3,
} from "three";


export let params = {
  mixShape: 0.0,
  sdfSize : 5,
  sdfScale : 5,
  boundingSphere : 5,
};


export function promisifyLoader ( loader, onProgress ) {
    function promiseLoader ( url ) {
      return new Promise( ( resolve, reject ) => {
        loader.load( url, resolve, onProgress, reject );
      } );
    }
    return {
      originalLoader: loader,
      load: promiseLoader,
    };
}

export function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}