import { useCallback, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil';
import { getFeedUserPostRequest } from '../api/post';
import feedPostsAtom from '../atoms/feedPostAtom';

const useFeedPosts = () => {
    const [feedPosts, setFeedPosts] = useRecoilState(feedPostsAtom);
    const isInitialMount = useRef(true);
  
    const resetPosts = useCallback(() => {
      setFeedPosts({
        posts: [],
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        loading: false,
        hasMore: true,
      });
    }, [setFeedPosts]);
  
    const fetchFeedPosts = useCallback(async (page = 1) => {
      if (feedPosts.loading || (!feedPosts.hasMore && page > 1)) return;
  
      setFeedPosts(prev => ({ ...prev, loading: true }));
  
      try {
        const response = await getFeedUserPostRequest(page)
        const { posts, currentPage, totalPages, totalPosts, hasNextPage } = response;
  
        setFeedPosts(prev => ({
          posts: page === 1 ? posts : [...prev.posts, ...posts],
          currentPage,
          totalPages,
          totalPosts,
          loading: false,
          hasMore: hasNextPage,
        }));
      } catch (error) {
        console.error('Error fetching feed posts:', error);
        setFeedPosts(prev => ({ ...prev, loading: false }));
      }
    }, [feedPosts.loading, feedPosts.hasMore, setFeedPosts]);
  
    useEffect(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        resetPosts();
        fetchFeedPosts();
      }
    }, [resetPosts, fetchFeedPosts]);
  
    const loadMore = useCallback(() => {
      if (feedPosts.hasMore && !feedPosts.loading) {
        fetchFeedPosts(feedPosts.currentPage + 1);
      }
    }, [feedPosts.hasMore, feedPosts.loading, feedPosts.currentPage, fetchFeedPosts]);
  
    return { feedPosts, fetchFeedPosts, loadMore, resetPosts };
}

export default useFeedPosts