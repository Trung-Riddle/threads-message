import { useCallback, useEffect, useRef } from "react";
import UserHeader from "../components/UserHeader";
import { useNavigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useUserPosts from "../hooks/useUserPosts";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const { userPosts, loadMore } = useUserPosts(username);
  const observer = useRef();
  // const navigate = useNavigate()
  

  

  const lastPostRef = useCallback(
    (node) => {
      if (userPosts.loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && userPosts.hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [userPosts.loading, userPosts.hasMore, loadMore]
  );

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) return <h1>User not found</h1>;
  return (
    <div>
      <UserHeader user={user} />
      {userPosts.posts.length === 0 && <h1>User has not posts.</h1>}
      {userPosts.loading && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {userPosts.posts.length > 0 &&
        userPosts.posts.map((post, index) => (
          <Box ref={index === userPosts.posts.length - 1 ? lastPostRef : null} key={index}>
            <Post post={post} postedBy={post.postedBy} isUserPage={true} />
          </Box>
        ))}
    </div>
  );
};

export default UserPage;
