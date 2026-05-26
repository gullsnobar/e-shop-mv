
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import CreateProduct from "../../components/Shop/CreateProduct";

const ShopCreateProduct = () => {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
        <DashboardHeader />
        <div className="flex items-start justify-between w-full">
            <div className="w-[80px] 800px:w-[260px] sticky top-[70px] h-[calc(100vh-70px)]">
              <DashboardSideBar active={4} />
            </div>
            <div className="flex-1 flex justify-center p-6 800px:p-10">
                <CreateProduct />
            </div>
          </div>
    </div>
  )
}

export default ShopCreateProduct