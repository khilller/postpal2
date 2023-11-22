import { atom } from 'recoil';

export const ProfileAtom = atom({
    key: 'profile',
    default: {
        credits: 0,
        uid: '',
    } as Profile,
});
