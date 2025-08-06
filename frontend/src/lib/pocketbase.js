import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.12.72:8090');

pb.autoCancellation(false);
pb.authStore.loadFromCookie(document.cookie);

export default pb;