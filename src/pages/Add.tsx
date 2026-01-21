import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

type FormValues = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function AddPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (values: any) => {
    const payload = {
      name: values.name,
      credit: Number(values.credit),
      category: values.category,
      teacher: values.teacher,
    };

    try {
      await axios.post("http://localhost:3000/courses", payload);
      toast.success("Thêm thành công");
      navigate("/list");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi thêm dữ liệu");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            {...register("name", { required: "Name is required", minLength: { value: 4, message: "Name must be at least 4 characters" } })}
            type="text"
            id="name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Teacher
          </label>
          <input
            {...register("teacher", { required: "Teacher is required", minLength: { value: 4, message: "Teacher must be at least 4 characters" } })}
            type="text"
            id="teacher"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.teacher && (
            <p className="text-sm text-red-600 mt-1">{errors.teacher.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Credit
          </label>
          <input
            {...register("credit", { required: "Credit is required", min: { value: 1, message: "Credit must be greater than 0" } })}
            type="number"
            id="credit"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.credit && (
            <p className="text-sm text-red-600 mt-1">{errors.credit.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block font-medium mb-1">
            Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            id="category"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue="Chuyên ngành"
          >
            <option value="Chuyên ngành">Chuyên ngành</option>
            <option value="Cơ sở">Cơ sở</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Thêm
        </button>
      </form>
    </div>
  );
}

export default AddPage;