// import React from 'react'
// import { Navigate, Outlet } from 'react-router-dom'
// import AppLayout from '../layout/AppLayout'


// const ProtectedRoute = () => {
//     const isAuthenticated = true
//     const loading = false

//     if(loading){
//         return <div>Loading...</div>
//     }


//   return isAuthenticated ? (
//         <AppLayout>
//             <Outlet />
//         </AppLayout>
//     ) : (
//         <Navigate to="/login" replace />
//     );
// }

// export default ProtectedRoute









import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    )
  }

  return user ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" replace />
  )
}

export default ProtectedRoute