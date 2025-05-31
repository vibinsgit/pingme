import Navbar from './Navbar'
import Sidebar from './Sidebar'

// children is comming from App.jsx as Layout within Homepage is wrapped
const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className='min-h-screen'>
        <div className='flex'>
            { showSidebar && <Sidebar /> }
            <div className='flex-1 flex flex-col'>
              <Navbar />
              {/* Here children is a HomePage */}
              <main className='flex-1 overflow-y-auto'> {children} </main>  
            </div>
        </div>
    </div>
  )
}

export default Layout