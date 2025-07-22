import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { HomePage } from "./pages/HomePage";
import PostPage from "./pages/PostPage";
// import { UsersPage } from './pages/UsersPage';
// import { UserPage } from './pages/UserPage';

export const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostPage />} />
        {/*  <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserPage />} /> */}
      </Routes>
    </AppLayout>
  );
};
