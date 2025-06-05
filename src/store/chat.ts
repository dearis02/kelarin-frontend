import { writable } from 'svelte/store';

const selectedChatRoomID = writable<string | undefined>(undefined);
const chatRoomOpen = writable<boolean>(false);

export { selectedChatRoomID, chatRoomOpen };
