import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";
import { followUnFollowRequest } from "../api/user";

const useFollowUnFollow = (user) => {
  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const data = await followUnFollowRequest(user._id);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        // Loại bỏ id cụ thể
        const index = user.followers.indexOf(currentUser._id);
        if (index > -1) {
          user.followers = [
            ...user.followers.slice(0, index),
            ...user.followers.slice(index + 1),
          ];
        }
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        // Thêm id vào cuối mảng
        user.followers = [...user.followers, currentUser._id];
      }
      setFollowing(!following);

      console.log(data);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };
  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnFollow;
