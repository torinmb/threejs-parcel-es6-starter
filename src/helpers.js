import {
  Vector3,
} from "three";


export let params = {
  testParam : 0.00001,
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