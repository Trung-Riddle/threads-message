import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postAtom";
import { getPostsRequest } from "../api/post";
import { useCallback, useEffect, useRef } from "react";

const useUserPosts = (username) => {
  const [userPosts, setUserPosts] = useRecoilState(postsAtom);
  const isInitialMount = useRef(true);

  const resetPosts = useCallback(() => {
    setUserPosts({
      posts: [],
      currentPage: 1,
      totalPages: 1,
      loading: false,
      hasMore: true,
    });
  }, [setUserPosts]);

  const fetchPosts = useCallback(async (page = 1) => {
    if (userPosts.loading || (!userPosts.hasMore && page > 1)) return;

    setUserPosts(prev => ({ ...prev, loading: true }));

    try {
      const response = await getPostsRequest(username, page);
      const { posts, currentPage, totalPages, hasNextPage } = response;

      setUserPosts(prev => ({
        posts: page === 1 ? posts : [...prev.posts, ...posts],
        currentPage,
        totalPages,
        loading: false,
        hasMore: hasNextPage,
      }));
    } catch (error) {
      console.error('Error fetching posts:', error);
      setUserPosts(prev => ({ ...prev, loading: false }));
    }
  }, [username, userPosts.loading, userPosts.hasMore, setUserPosts]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      resetPosts();
      fetchPosts();
    }
  }, [username]);

  const loadMore = useCallback(() => {
    if (userPosts.hasMore && !userPosts.loading) {
      fetchPosts(userPosts.currentPage + 1);
    }
  }, [userPosts.hasMore, userPosts.loading, userPosts.currentPage, fetchPosts]);

  const addNewPost = useCallback((newPost) => {
    setUserPosts(prev => {
      const updatedPosts = [newPost, ...prev.posts];
      return {
        ...prev,
        posts: updatedPosts,
        totalPages: Math.max(prev.totalPages, Math.ceil(updatedPosts.length / 8)),
        hasMore: updatedPosts.length < prev.totalPages * 8,
      };
    });
  }, [setUserPosts]);

  return { userPosts, fetchPosts, loadMore, addNewPost };
};
export default useUserPosts;
