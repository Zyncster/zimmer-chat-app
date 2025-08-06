import PocketBase from 'pocketbase';

const pb = new PocketBase('http://http://172.236.115.165:8090');

pb.autoCancellation(false);
pb.authStore.loadFromCookie(document.cookie);

export default pb;