import React from 'react'
import { useNavigate } from 'react-router-dom'

const DropDown = ({categoriesData, setDropDown}) => {
    const navigate = useNavigate();
    const submitHandler = (i) => {
        setDropDown(false);
        navigate(`/products?category=${i.title}`);
        window.location.reload();
    };

    return (
        <div className='pb-2 w-[260px] bg-white absolute z-30 rounded-b-md shadow-lg border border-gray-100 top-full left-0 mt-1'>
            {categoriesData && categoriesData.map((i, index) => (
                <div
                    key={index}
                    className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors'
                    onClick={() => submitHandler(i)}
                >
                    <img
                        src={i.images}
                        alt={i.title}
                        className='w-[28px] h-[28px] object-cover rounded-sm flex-shrink-0'
                    />
                    <h3 className='text-sm font-medium text-gray-700 cursor-pointer select-none line-clamp-1'>
                        {i.title}
                    </h3>
                </div>
            ))}
        </div>
    )
}

export default DropDown
