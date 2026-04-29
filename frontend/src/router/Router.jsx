import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import MyPage from "../pages/MyPage";
import CustomerCenter from "../pages/CustomerCenter";
import ProductDetail from "../pages/ProductDetail";
import SearchBox from "../pages/SearchBox";
import SearchResultPage from "../pages/SearchResultPage.tsx";
import Login from "../pages/Login.jsx";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/customer" element={<CustomerCenter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<SearchBox />} />
        <Route path="/search/result" element={<SearchResultPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
