import { atom } from 'recoil';

export const PostAtom = atom({
    key: 'post',
    default: {
        title: "",
        content: "",
        uid: ""
    } as Post
});