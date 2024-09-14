import { atom } from 'recoil';

const modalAtom = atom({
  key: 'modalState',
  default: {
    isOpen: false,
    type: null,
    data: null
  },
});
export default modalAtom