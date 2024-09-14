import { atom } from "recoil";

const postsAtom = atom({
  key: "postsAtom",
  default: {
    posts: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    hasMore: true,
  },
});

export default postsAtom;
