import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Course = {
  id: string | number;
  name: string;
  credit?: number;
  category?: string;
  teacher?: string;
};

function ListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [teachers, setTeachers] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [total, setTotal] = useState(0);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // fetch teachers (unique) for filter
  useEffect(() => {
    const getTeachers = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        const names = Array.from(new Set(data.map((c: Course) => c.teacher).filter(Boolean)));
        setTeachers(names as string[]);
      } catch (error) {
        console.error(error);
      }
    };
    getTeachers();
  }, []);

  // fetch courses with params: _page, _limit, name_like, teacher
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { _page: page, _limit: limit };
        if (debouncedSearch) params.name_like = debouncedSearch;
        if (teacherFilter) params.teacher = teacherFilter;

        const res = await axios.get("http://localhost:3000/courses", { params });
        setCourses(res.data);
        const totalCount = res.headers["x-total-count"] ?? res.data.length;
        setTotal(Number(totalCount));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [debouncedSearch, teacherFilter, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên..."
          className="w-full md:w-1/3 border rounded-lg px-3 py-2"
        />

        <select
          value={teacherFilter}
          onChange={(e) => { setTeacherFilter(e.target.value); setPage(1); }}
          className="w-full md:w-1/4 border rounded-lg px-3 py-2"
        >
          <option value="">-- Lọc theo giảng viên --</option>
          {teachers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <div className="ml-auto text-sm text-gray-600">{loading ? "Đang tải..." : `Tổng: ${total}`}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Credit</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Category</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Teacher</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((item) => (
              <tr key={String(item.id)} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border border-gray-300">{item.credit ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{item.category ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{item.teacher ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <Link to={`/edit/${item.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 border rounded ${p === page ? "bg-blue-600 text-white" : ""}`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ListPage;