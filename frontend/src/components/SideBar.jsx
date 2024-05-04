import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
import logo from "../assets/logo.png"
import profile from "../assets/user.png"
import { createContext, useContext, useState } from "react"

const SidebarContext = createContext();

export  function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(true)
    return (
        <>
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img src={logo} alt="" />
                    {/* <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"><ChevronFirst/></button> */}
                </div>
                {/* <SidebarContext.Provider> */}

                        <ul className="flex-1 px-3">{children}</ul>
                    {/* </SidebarContext.Provider> */}
            </nav>
        </aside>
            
        </>
    )
}

export function SidebarItem({ icon, text, active }) {
    // const { expanded } = useContext(SidebarContext)
    return (
        <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}`}>
            {icon}
            <span className="overflow-hidden transition-all w-52 ml-3">{text}</span>
        </li>
    )
}