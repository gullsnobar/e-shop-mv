import React, {useState} from 'react'
import Header from "../components/Layout/Header"
import styles from "../styles/styles"
import ProfileSidebar from "../components/Profile/ProfileSidebar"
import ProfileContent from '../components/Profile/ProfileContent'

const ProfilePage = () => {
    const [active, setActive] = useState(1);
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
        <Header />
        <div className={`${styles.section} py-6 lg:py-10`}>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - horizontal tabs on mobile, vertical sidebar on desktop */}
            <div className="w-full lg:w-[280px] flex-shrink-0">
              <ProfileSidebar active={active} setActive={setActive} />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <ProfileContent active={active} />
            </div>
          </div>
        </div>
    </div>
  )
}

export default ProfilePage
