import { BrowserRouter, Routes, Route, useSearchParams  } from "react-router-dom";
import Home from "../pages/Home.jsx";
import MyPage from "../pages/MyPage";
import CustomerCenter from "../pages/CustomerCenter";
import ProductDetail from "../pages/ProductDetail";
import SearchBox from "../pages/SearchBox";
import SearchResult from "../pages/SearchResult";
import Login from "../pages/Login.jsx";
import Signup from "../pages/SignUp.jsx";

function SearchResultWithKey() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("q") || "";
  return <SearchResult key={keyword} />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/customer" element={<CustomerCenter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchBox />} />
        <Route path="/search/result" element={<SearchResultWithKey />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
