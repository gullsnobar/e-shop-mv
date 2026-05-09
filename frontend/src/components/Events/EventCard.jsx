import React from 'react'
import styles from '../../styles/styles'
import CountDown from "./CountDown"

const EventCard = ({ data, active }) => {
  const discountPrice = data?.discountPrice ?? data?.discount_price ?? 0;
  const originalPrice = data?.originalPrice ?? data?.price ?? 0;
  const sold = data?.sold_out ?? data?.total_sell ?? 0;
  const imageUrl = data?.images?.[0]?.url ?? "";

  return (
    <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-3 gap-4`}>
      <div className='w-full lg:w-[50%] m-auto flex items-center justify-center min-h-[250px]'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data?.name || "Event product"}
            className="w-full max-h-[300px] object-contain rounded-md"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `<div class="w-full h-[250px] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">No Image</div>`;
            }}
          />
        ) : (
          <div className="w-full h-[250px] bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className='w-full lg:w-[50%] flex flex-col justify-center'>
        <h2 className={`${styles.productTitle}`}>
          {data?.name || "Event Product"}
        </h2>
        <p className="text-[16px] text-gray-600 pt-2 leading-relaxed">
          {data?.description
            ? data.description.length > 200
              ? data.description.slice(0, 200) + "..."
              : data.description
            : "Exclusive event deal with limited-time pricing. Grab it before it's gone!"}
        </p>

        <div className="flex py-3 justify-between items-center">
          <div className="flex items-center gap-2">
            {originalPrice > 0 && (
              <h5 className="font-[500] text-[#d55b45] line-through">
                ${originalPrice}
              </h5>
            )}
            <h5 className='font-bold text-[20px] text-[#333] font-Roboto'>
              ${discountPrice}
            </h5>
          </div>

          <span className='font-[400] text-[17px] text-[#44a55e]'>
            {sold} sold
          </span>
        </div>

        <CountDown />
      </div>
    </div>
  )
}

export default EventCard
