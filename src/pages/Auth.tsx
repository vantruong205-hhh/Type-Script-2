import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

type LoginForm = {
    email: string;
    password: string;
};

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const loginForm = useForm<LoginForm>();
    const registerForm = useForm<RegisterForm>();

    const onLogin = async (data: LoginForm) => {
        try {
            const res = await axios.post("http://localhost:3000/login", data);
            localStorage.setItem("token", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.dispatchEvent(new Event("userChanged"));
            toast.success("Đăng nhập thành công");
            navigate("/list");
        } catch (error) {
            toast.error("Đăng nhập thất bại");
        }
    };

    const onRegister = async (data: RegisterForm) => {
        if (data.password !== data.confirmPassword) {
            registerForm.setError("confirmPassword", { message: "Mật khẩu xác nhận không khớp" });
            return;
        }
        try {
            await axios.post("http://localhost:3000/register", {
                username: data.username,
                email: data.email,
                password: data.password,
            });
            toast.success("Đăng ký thành công");
            setIsLogin(true);
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Đăng ký thất bại");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsLogin(true)}
                    className={`px-4 py-2 ${isLogin ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-l-lg`}
                >
                    Đăng nhập
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`px-4 py-2 ${!isLogin ? "bg-blue-600 text-white" : "bg-gray-200"} rounded-r-lg`}
                >
                    Đăng ký
                </button>
            </div>

            {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">Đăng nhập</h2>
                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            {...loginForm.register("email", { required: "Email là bắt buộc" })}
                            type="email"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {loginForm.formState.errors.email && (
                            <p className="text-red-600 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mật khẩu</label>
                        <input
                            {...loginForm.register("password", { required: "Mật khẩu là bắt buộc" })}
                            type="password"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {loginForm.formState.errors.password && (
                            <p className="text-red-600 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
                        )}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
                        Đăng nhập
                    </button>
                </form>
            ) : (
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">Đăng ký</h2>
                    <div>
                        <label className="block font-medium mb-1">Tên người dùng</label>
                        <input
                            {...registerForm.register("username", {
                                required: "Tên người dùng là bắt buộc",
                                minLength: { value: 5, message: "Tên người dùng phải có hơn 4 ký tự" },
                            })}
                            type="text"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {registerForm.formState.errors.username && (
                            <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.username.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            {...registerForm.register("email", {
                                required: "Email là bắt buộc",
                                pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" },
                            })}
                            type="email"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {registerForm.formState.errors.email && (
                            <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Mật khẩu</label>
                        <input
                            {...registerForm.register("password", {
                                required: "Mật khẩu là bắt buộc",
                                minLength: { value: 7, message: "Mật khẩu phải có hơn 6 ký tự" },
                            })}
                            type="password"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {registerForm.formState.errors.password && (
                            <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Xác nhận mật khẩu</label>
                        <input
                            {...registerForm.register("confirmPassword", { required: "Xác nhận mật khẩu là bắt buộc" })}
                            type="password"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                        {registerForm.formState.errors.confirmPassword && (
                            <p className="text-red-600 text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
                        Đăng ký
                    </button>
                </form>
            )}
        </div>
    );
}

export default AuthPage;