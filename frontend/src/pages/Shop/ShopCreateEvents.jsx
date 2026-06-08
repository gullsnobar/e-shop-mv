
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import CreateEvent from "../../components/Shop/CreateEvent";
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';

const ShopCreateEvents = () => {
  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[330px] flex-shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
          <DashboardSideBar active={6} />
        </div>
        <div className="flex-1 min-w-0 p-4 800px:p-8">
          <CreateEvent />
        </div>
      </div>
    </div>
  )
}

export default ShopCreateEvents