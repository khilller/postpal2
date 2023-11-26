import {atom} from 'recoil';

export const refetchCreditsAtom = atom({
    key: 'fetchCredits',
    default: false
})