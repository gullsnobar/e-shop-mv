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
        <div className='w-[230px] bg-white absolute z-[100] rounded-md shadow-xl border border-gray-100 top-full left-0 mt-1 max-h-[60vh] overflow-y-auto'>
            {categoriesData && categoriesData.map((i, index) => (
                <div
                    key={index}
                    className={`group flex items-center gap-3 px-4 py-2.5 hover:bg-[#3321c8] cursor-pointer transition-colors ${
                        index === 0 ? 'rounded-t-md' : ''
                    } ${
                        index === categoriesData.length - 1 ? 'rounded-b-md' : ''
                    }`}
                    onClick={() => submitHandler(i)}
                >
                    <img
                        src={i.images}
                        alt={i.title}
                        className='w-[28px] h-[28px] object-cover rounded-sm flex-shrink-0'
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <h3 className='text-sm font-medium text-gray-700 group-hover:text-white cursor-pointer select-none line-clamp-1'>
                        {i.title}
                    </h3>
                </div>
            ))}
        </div>
    )
}

export default DropDown
