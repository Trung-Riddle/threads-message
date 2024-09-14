import { useRecoilCallback } from "recoil";
import postsAtom from "../atoms/postAtom";
import feedPostsAtom from "../atoms/feedPostAtom";
import { likeAndUnlikePostRequest, replyPostRequest } from "../api/post";
import useShowToast from "./useShowToast";

const usePostActions = () => {
  const toast = useShowToast()
  const updatePost = useRecoilCallback(
    ({ set }) =>
      (postId, updateFunction, isUserPage) => {
        const targetAtom = isUserPage ? postsAtom : feedPostsAtom;
        set(targetAtom, (prevState) => ({
          ...prevState,
          posts: prevState.posts.map((post) =>
            post._id === postId ? updateFunction(post) : post
          ),
        }));
      }
  );
  const handleLike = async (postId, userId, isUserPage) => {
    try {
      const response = await likeAndUnlikePostRequest(postId)
      if (response.error) {
        toast('Oops!', 'Something wrong')
        return
      }

      updatePost(
        postId,
        (post) => ({
          ...post,
          likes: post.likes.filter((id) => id !== userId),
        }),
        isUserPage
      );
    } catch (error) {
      console.error("Error like post:", error);
    }
  };
  const handleUnlike = async (postId, userId, isUserPage) => {
    try {
      const response = await likeAndUnlikePostRequest(postId)
      if (response.error) {
        toast('Oops!', 'Something wrong')
        return
      }
      updatePost(
        postId,
        (post) => ({
          ...post,
          likes: [...post.likes, userId],
        }),
        isUserPage
      );
    } catch (error) {
      console.error("Error unlike post:", error);
    }
  };

  const handleReply = async (postId, text, isUserPage) => {
    try {
      const newReply = await replyPostRequest(postId, text);
      if (newReply.error) {
        toast('Oops!', 'Something wrong')
        return
      }
      updatePost(
        postId,
        (post) => ({
          ...post,
          replies: [...post.replies, newReply],
        }),
        isUserPage
      );
      return newReply
    } catch (err) {
      console.error("Error replying to post:", err);
    }
  };
  return { handleLike, handleUnlike, handleReply };
};

export default usePostActions;
