import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Tạo context với giá trị mặc định
export const AuthContext = createContext({
    user: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false
});

// Custom hook để sử dụng auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Provider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Khởi tạo state từ localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            
            console.log('Loading auth state:', { hasStoredUser: !!storedUser, hasToken: !!token });
            
            if (storedUser && token) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                console.log('Loaded user:', userData);
            }
        } catch (error) {
            console.error('Error loading auth state:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (userData) => {
        try {
            if (!userData) {
                throw new Error('Dữ liệu người dùng không hợp lệ');
            }

            console.log('Setting user state:', userData);
            
            // Cập nhật state
            setUser(userData);
            
            // Đảm bảo dữ liệu được lưu vào localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            setUser(null);
            localStorage.removeItem('user');
            throw error;
        }
    };

    const logout = () => {
        console.log('Logging out...');
        
        // Xóa state
        setUser(null);
        
        // Xóa dữ liệu từ localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken'); // Xóa cả accessToken nếu có
        
        // Xóa tất cả cookie liên quan đến authentication (nếu có)
        document.cookie.split(";").forEach(function(c) {
            document.cookie = c.replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Chuyển hướng về trang login
        setTimeout(() => {
            navigate('/login');
        }, 100);
    };

    const isAuthenticated = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return false;
            }
            
            // Kiểm tra xem user có trong state không
            if (user) {
                return true;
            }
            
            // Kiểm tra xem user có trong localStorage không
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                return false;
            }
            
            // Nếu có user trong localStorage nhưng không có trong state,
            // cập nhật state luôn
            if (!user && storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    // Đây là side effect, nhưng cần thiết để đồng bộ state
                    setUser(userData);
                } catch (e) {
                    console.error('Error parsing stored user during auth check:', e);
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error checking authentication:', error);
            return false;
        }
    };

    // Cung cấp giá trị context
    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        isLoading
    };

    // Không render children cho đến khi đã load xong initial state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}