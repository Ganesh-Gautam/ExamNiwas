import { useEffect } from "react";
import { useSelector } from "react-redux"; 
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children ,authentication = true }) {
  const navigate= useNavigate();
  const authStatus =useSelector(state => state.auth.status);

  useEffect(()=>{
    if(authentication && authStatus !==authentication){
      navigate("/login", { replace: true })
    } else if (!authentication && authStatus!==authentication){
      navigate("/", { replace: true })
    } 
  },[authStatus, navigate, authentication])

  return (
    <div className="min-h-screen .bg-\[radial-gradient\(circle_at_top_left\,_rgba\(59\,130\,246\,0\.12\)\,_transparent_30\%\)\,radial-gradient\(circle_at_bottom_right\,_rgba\(249\,115\,22\,0\.12\)\,_transparent_32\%\)\,linear-gradient\(180deg\,\#f8fafc_0\%\,\#eef2ff_100\%\)\] px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        {children}
      </div>
    </div>
  );
}
