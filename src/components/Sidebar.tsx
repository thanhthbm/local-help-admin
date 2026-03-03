import { Link } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  Users, 
  LogOut,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const { user, logout } = useAuth() // Lấy cả user và hàm logout từ Hook

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Danh mục', icon: Layers, to: '/categories' },
    { label: 'Công việc', icon: Briefcase, to: '/jobs' },
    { label: 'Người dùng', icon: Users, to: '/users' },
  ]

  // Nếu chưa có user (chưa login xong) thì không hiện Sidebar
  if (!user) return null;

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">L</div>
        <span className="text-xl font-bold text-gray-800">LocalHelp</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeProps={{ className: 'bg-orange-50! text-orange-600!' }}
            className="flex items-center justify-between p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all group"
          >
            <div className="flex items-center gap-3">
              {typeof item.icon !== 'string' && <item.icon size={20} />}
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </nav>

      {/* User Info & Logout Button */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img 
            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.fullName}`} 
            className="w-10 h-10 rounded-full border border-orange-100"
            alt="Admin"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 uppercase">{user.role}</p>
          </div>
        </div>

        <button 
          onClick={() => {
            if(window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
              logout(); // Gọi hàm xóa token và redirect
            }
          }}
          className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar