import { writable } from 'svelte/store';
export let username =  writable('');
export let isSwimmer =  writable('');
export let friendNick =  writable('');
export let sClass =  writable('');
export let usernameUnique =  writable(true);
export let emailUnique =  writable(true);
export let email =  writable('');
export let password =  writable('');
export let confPassword =  writable('');
export let loginUsername = writable('')
export let loginPassword = writable('')