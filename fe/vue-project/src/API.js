import axios from "axios"
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

export const getAllMonitoringStatus = async () => {
    try {
        const res = await api.get('/admin/monitoringStatus');
        return res.data;
    } catch(err) {
        console.error('Lỗi khi gọi API:', err);
    }
}

export const getAreaByCardId = async (cardId) => {
    const res = await api.get(`/user/getAreaByCardId/${cardId}`);
    return res.data;
}

export const getProvinces = async () => {
    const res = await axios.get('https://provinces.open-api.vn/api/?depth=1');
    return res.data;
}

export const getDistricts = async (provinceCode) => {
   const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`) ;
   return res.data;
}

export const getWards = async (districtCode) => {
    const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    return res.data;
}

export const createUser = async (user) => {
    const res = await api.post('/admin/users',user);
    return res.data;
}

export const getAllUsers = async () => {
    const res = await api.get('/admin/users');
    return res.data;
}

export const getUserByCardId = async (cardId) => {
    const res = await api.get(`/user/getUserByCardId/${cardId}`);
    return res.data;
}

export const updateUser = async (cardId,user) => {
    const res = await api.patch(`/admin/users/${cardId}`,user);
    return res.data;
}

export const getAllNotifications = async () => {
    const res = await api.get('/admin/notifications');
    return res.data;
}


export const login = async (data) => {
    const res = await api.post('/admin/login',data);
    return res.data;
}

export const logout  = async () => {
    const res = await api.post('/admin/logout');
    return res;
}