import React from 'react'
import { NavLink } from 'react-router'

const ProblemCard = ({problem}) => {
  return (
    <>
    
        <div className='h-20 bg-gray-800 rounded mt-2'>
       <div className=' flex items-center justify-between p-4'>
          <NavLink to={`/problem/${problem._id}`} className="hover:text-primary text-2xl">
            {problem?.title}
          </NavLink>

          <span className={`text-2xl ${problem.difficulty==="easy" ? "bg-green-400 rounded-full px-6 py-1" : ""}   ${problem.difficulty==="medium" ? "bg-yellow-400 rounded-full px-6 py-1" : ""}  ${problem.difficulty==="hard" ? "bg-red-500 rounded-full px-6 py-1" : ""} `}>
            {problem.difficulty}
          </span>
       </div>
    </div>
    
    </>
  )
}

export default ProblemCard