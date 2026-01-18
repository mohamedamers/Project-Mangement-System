import axios from "axios";

// تعريف الواجهة (Interface) للبيانات المطلوبة
interface GetUsersParams {
  pageSize: number;
  pageNumber: number;
  userName?: string;
}

export const getUsersFun = async ({ pageSize, pageNumber, userName }: GetUsersParams) => {
  // توكن تسجيل الدخول (عادة بيتحفظ في الـ LocalStorage)
  const token = localStorage.getItem("userToken");

  try {
    const response = await axios.get("https://upskilling-egypt.com:3006/api/v1/Users/", {
      // إرسال البارامترات (رقم الصفحة، حجمها، والبحث)
      params: {
        pageSize: pageSize,
        pageNumber: pageNumber,
        userName: userName,
      },
      // إرسال الـ Token في الهيدر عشان السيرفر يوافق على الطلب
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // إرجاع البيانات الناتجة
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};