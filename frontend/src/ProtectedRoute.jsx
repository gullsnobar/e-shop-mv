import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if(!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoute
