import React from 'react'
import styles from '../../styles/styles'
import CountDown from "./CountDown"

const EventCard = ({ data }) => {
  const discountPrice = data?.discountPrice ?? data?.discount_price ?? 0;
  const originalPrice = data?.originalPrice ?? data?.price ?? 0;
  const sold = data?.sold_out ?? data?.total_sell ?? 0;
  const imageUrl = data?.images?.[0]?.url ?? "";

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="w-full lg:w-[45%] flex items-center justify-center bg-gray-50 p-4 min-h-[280px]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={data?.name || "Event product"}
              className="w-full max-h-[280px] object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div class="w-full h-[250px] flex items-center justify-center text-gray-400 text-sm">No Image</div>`;
              }}
            />
          ) : (
            <div className="w-full h-[250px] flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center p-6 lg:p-8">
          <h2 className="text-[22px] font-[600] font-Roboto text-[#333] leading-tight">
            {data?.name || "Event Product"}
          </h2>

          <p className="text-[15px] text-gray-500 mt-3 leading-relaxed">
            {data?.description
              ? data.description.length > 220
                ? data.description.slice(0, 220) + "..."
                : data.description
              : "Exclusive event deal with limited-time pricing. Grab it before it's gone!"}
          </p>

          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-3">
              {originalPrice > 0 && (
                <span className="text-[16px] text-[#d55b45] line-through font-medium">
                  ${originalPrice}
                </span>
              )}
              <span className="text-[24px] font-bold text-[#3321c8] font-Roboto">
                ${discountPrice}
              </span>
            </div>

            <span className="text-[15px] text-[#44a55e] font-medium">
              {sold} sold
            </span>
          </div>

          <div className="mt-5">
            <CountDown />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
