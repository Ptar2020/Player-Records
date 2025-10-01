"use client";
import axios from "axios";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_utils/AuthProvider";
import { showErrorMsg } from "./_utils/Alert";

export default function Main() {
  const router = useRouter();

  const { setUser } = useAuth();
  const getRefreshToken = useCallback(async () => {
    try {
      const res = await axios.post(
        "/api/user/getRefreshtoken",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const { userInfo } = res.data;
        // console.log(userInfo);
        setUser(userInfo);
      } else {
        // error experienced
        showErrorMsg(res.data.msg);
        setUser(null);
        router.push("/login");
      }
    } catch (error) {
      showErrorMsg(error instanceof Error ? error.message : "Error occurred");
    }
  }, [router, setUser]);

  useEffect(() => {
    getRefreshToken();
  }, [getRefreshToken]);

  return null;
}
