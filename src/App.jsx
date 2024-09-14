import { Container, Flex, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Layout from "./pages/Layout";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import { useLoading } from "./hooks/useApp";
import ChatPage from "./pages/ChatPage";
import Test from "./Test"

function App() {
  const user = useRecoilValue(userAtom);
  const { isLoading } = useLoading();
  const { pathname } = useLocation();
  // console.log(user)
  return (
    <Container
      maxW={(pathname === "/" || pathname === '/chat') ? { base: "620px", md: "900px" } : "620px"}
    >
      {isLoading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.7)"
          zIndex={999}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size={"xl"}
          ></Spinner>
        </Flex>
      )}
      <Routes>
        <Route path="" element={<Layout />}>
          <Route path="/profile/:username" element={user ? <UserPage /> : <Navigate to="/auth" />} />
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />
          <Route path="/:username/post/:pid" element={user ? <PostPage /> : <Navigate to={'/auth'} />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;
