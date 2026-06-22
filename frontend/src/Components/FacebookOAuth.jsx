import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function OAuthFacebook() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFacebookClick = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/api/auth/facebook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();

            localStorage.setItem("token", data.token);

            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            console.log("Could not login with Facebook", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleFacebookClick}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 border border-[#e2e8f0] dark:border-zinc-800 py-3 px-6 rounded-full transition-all hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm group"
        >
            <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                />
            </svg>

            <span className="text-[15px] font-semibold text-[#2d3748] dark:text-zinc-200">
                Sign in with Facebook
            </span>

            <ArrowRight
                size={18}
                className="text-slate-300 dark:text-zinc-600 group-hover:text-slate-500 dark:group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all"
            />
        </button>
    );
}