import { Link, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import các trang
import List from "./pages/List";
import Add from "./pages/Add";
import Edit from "./pages/Edit";


function App() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-blue-600 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">
            <strong>WEB501 App</strong>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="#" className="hover:text-gray-200">Trang chủ</Link>
            <Link to="/list" className="hover:text-gray-200">Danh sách</Link>
            <Link to="/add" className="hover:text-gray-200">Thêm mới</Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="#" className="hover:text-gray-200">Đăng nhập</Link>
            <Link to="#" className="hover:text-gray-200">Đăng ký</Link>
          </div>
        </div>
      </nav>

      {/* ROUTERS */}
      <Routes>
        <Route
          path="/"
          element={
            <div className="max-w-6xl mx-auto mt-10 px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">Chào mừng đến với WEB501</h1>
              <p className="text-lg text-gray-600">Ứng dụng quản lý dữ liệu</p>
            </div>
          }
        />

        <Route path="/list" element={<List />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;