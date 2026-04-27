import React from 'react'
import { useNavigation } from 'react-router-dom'

const DropDown = ({categoriesData, setDropDown}) => {
    const navigate = useNavigation();
    const submitHandler = (i) => {
        setDropDown(false);
        navigate(`/products?category=${i.title}`);
        setDropDown(false);
        window.location.reload();
    };
  return (

    <div className='pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm'>
        {
            categoriesData && categoriesData.map((i, index) => (
                <div
                    key={index}
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    onClick={() => submitHandler(i)}
                >

                    <img src={i.image_Url} alt={i.title} 
                    style={{
                        width: "25px",
                        height: "25px",
                        objectFit:"contain",
                        marginLeft:"none"
                    }}
                    
                    />
                   <h3 className='m-3 cursor-pointer select-none'>{i.title}</h3>
                </div>
            ))
        }
      
    </div>
  )
}

export default DropDown
