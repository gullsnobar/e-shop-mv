import React, { Fragment } from 'react'
import { useNavigate } from "react-router-dom";
import styles from '../../../styles/styles'
import { brandingData, categoriesData } from '../../../static/data'

const Categories = () => {
  const navigate = useNavigate();

  const handleSubmit = (i) => {
    navigate(`/product?category=${i.title}`);
  };

  return (
    <Fragment>
      <div className={`${styles.section} hidden sm:block`}>
        
        <div className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}>
          {
            brandingData && brandingData.map((i, index) => (
              <Fragment key={index}>
                <div className="flex flex-col items-start">
                  {i.icon}
                  <div className='px-3'>
                    <h3 className='font-bold text-sm md:text-base'>
                      {i.title}
                    </h3>
                    <p className='text-xs text-gray-500 mt-1'>
                      {i.description}
                    </p>
                  </div>
                </div>
              </Fragment>
            ))
          }
        </div>

        <div 
          className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
          id='categories'
        >

          <div className='grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]'>
            {
              categoriesData && categoriesData.map((i) => (
                <Fragment key={i.id}>
                  <div 
                    className='w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden'
                    onClick={() => handleSubmit(i)}
                  >
                    <h5 className='text-[10px] leading-[1.3]'>{i.title}</h5>
                    <img src={i.image_Url} alt={i.title} 
                    className='w-[120px] object-cover'
                    
                    />
                  </div>
                </Fragment>
              ))
            }
          </div>

        </div>
      
      </div>
    </Fragment>
  )
}

export default Categories