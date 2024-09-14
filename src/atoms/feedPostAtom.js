import { atom } from "recoil";

const feedPostsAtom = atom({
  key: "feedPostsAtom",
  default: {
    posts: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,
    hasMore: true,
  },
});

export default feedPostsAtom;