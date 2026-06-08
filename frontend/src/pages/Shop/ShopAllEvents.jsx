
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllEvents from "../../components/Shop/AllEvents";

const ShopAllEvents = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[330px] flex-shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
          <DashboardSideBar active={5} />
        </div>
        <div className="flex-1 min-w-0 p-4 800px:p-8">
          <AllEvents />
        </div>
      </div>
    </div>
  )
}

export default ShopAllEvents