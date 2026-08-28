import Image from "next/image"
import { Button } from '../../../components/ui/button'
import WorkspaceHistory from './WorkspaceHistory'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    useSidebar,
  } from "../../../components/ui/sidebar"

 
import { LogOut, MessageCircleCode, SettingsIcon} from "lucide-react"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { useRouter } from "next/navigation"
import { MessageContext } from "../../context/MessageContext"

   
  export function AppSidebar() {
 const { messages, setMessages } = useContext(MessageContext);
  const { user, setUser } = useContext(UserContext)
    


    const {toggleSideBar} =useSidebar()
    const router =useRouter()
    const handleLogoClick = () => {
      router.push("/");
    };

    const handleSignOut = () => {
      // Clear user from context
      setUser(null);
  
      // Remove user data from localStorage
      localStorage.removeItem("user");
  
      router.push("/"); // or router.push("/login") if you have a specific login page

    };
const pricingClick=()=>{
  router.push("/pricing");  // Navigate to /pricing page
}
    const handleProfileClick = () => {
      router.push("/profile");  // Navigate to /profile page
    };
    return (
      <Sidebar>
        
        <SidebarHeader className='p-3' />
     
          <Image className='rounded-full' src={user?.image||'/logo.png'} alt='User Image' width={40} height={40}  onClick={handleLogoClick}></Image>
        <SidebarContent className='p-5'>
          <Button>  <MessageCircleCode/> Start new chat</Button>
        
          <WorkspaceHistory/>
          <SidebarGroup />
          
        </SidebarContent>
        <SidebarFooter className="p-3 bg-slate-950 border-t border-slate-800/80">
          {user?.name ? (
            <div className="flex flex-col gap-2">
              {/* Token balance / Subscription Quick Link */}
              <div 
                onClick={pricingClick}
                className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition group shadow-lg"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">My Subscription</span>
                  <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Upgrade</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tokens:</span>
                  <span className="text-sm font-extrabold text-white font-mono">
                    {Number(user?.tokens || user?.token || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* User Profile info */}
              <div 
                onClick={handleProfileClick}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:bg-slate-800 transition"
              >
                {user?.image ? (
                  <Image
                    className="rounded-full border border-indigo-500/40"
                    src={user.image}
                    alt="user"
                    width={28}
                    height={28}
                  />
                ) : null}
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white truncate">{user?.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{user?.email}</span>
                </div>
              </div>

              <div 
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </div>
            </div>
          ) : (
            <div 
              onClick={pricingClick}
              className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center cursor-pointer hover:bg-indigo-900/40 transition"
            >
              <span className="text-xs font-semibold text-indigo-300">View Subscription Plans</span>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
    )
  }