import { Box, Flex, Spinner, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef } from "react";
import useFeedPosts from "../hooks/useFeedPosts";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const observer = useRef();
  const { feedPosts, loadMore, resetPosts } = useFeedPosts();
  console.log(feedPosts)
  const lastPostRef = useCallback(
    (node) => {
      if (feedPosts.loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && feedPosts.hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [feedPosts.loading, feedPosts.hasMore, loadMore]
  );
  useEffect(() => {
    resetPosts();
  }, []);
  return (
    <>
      <Flex gap={10}>
        <VStack flex={70} spacing={4} align="stretch" mt={4}>
          {feedPosts.posts.length > 0 &&
            feedPosts.posts.map((post, index) => (
              <Box
                key={post._id}
                ref={index === feedPosts.posts.length - 1 ? lastPostRef : null}
              >
                <Post post={post} postedBy={post.postedBy} isUserPage={false} />
              </Box>
            ))}
        </VStack>
        <Flex
          flex={30}
          position={"relative"}
          display={{
            base: "none",
            md: "block",
          }}
        >
          {/* <SuggestedUsers /> */}
        </Flex>
      </Flex>
      {feedPosts.loading && (
        <Box textAlign={"center"} mt={4}>
          <Spinner />
        </Box>
      )}
    </>
  );
};

export default HomePage;
