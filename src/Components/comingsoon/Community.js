import React from 'react';
import image from '../../Images/comingsoon.jpg';

export const Community = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="text-center">
        <img
          src={image}
          alt="Coming Soon"
          className="mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg "
        />
        
      </div>
    </div>
  );
};

export default Community;
