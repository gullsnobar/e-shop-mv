import styles from '../../styles/styles'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ShopPreviewPage = () => {
  const { id: shopId } = useParams();
  const { seller, isSeller } = useSelector((state) => state.seller);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (isSeller && seller && seller._id === shopId) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [shopId, seller, isSeller]);

  return (
    <div className={`${styles.section} bg-[#f5f5f5] min-h-screen`}>
      <div className="w-full flex flex-col 800px:flex-row gap-5 py-10">

        {/* LEFT SIDEBAR */}
        <div className="w-full 800px:w-[25%] 800px:min-w-[260px] 800px:max-w-[300px]">
          <div className="bg-white rounded-[4px] shadow-sm 800px:sticky top-10 800px:overflow-y-auto 800px:max-h-[90vh]">
            <ShopInfo isOwner={isOwner} />
          </div>
        </div>

        {/* RIGHT MAIN CONTENT */}
        <div className="w-full 800px:flex-1">
          <ShopProfileData isOwner={isOwner} />
        </div>

      </div>
    </div>
  );
};

export default ShopPreviewPage;