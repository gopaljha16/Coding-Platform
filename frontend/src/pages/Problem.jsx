import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import Navbar from "../components/common/Navbar";
import ProblemCard from "../components/common/ProblemCard";
import SubmitCard from "../components/common/SubmitCard";


const Problem = () => {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters , setFilters] = useState({
     difficulty: 'all',
     tag: 'all',
     status: 'all' 
  })

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblems");
        setProblems(data);
      } catch (err) {
        console.error("Error While Fetching the Problems", err);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient("/problem/problemsSolvedByUser");
        setSolvedProblems(data);
      } catch (err) {
        console.error("Error Occured while fetching all solved Problems", err);
      }
    };

    fetchProblem();
    if (user) fetchSolvedProblems();
  }, [user]);


   const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });



  return (
    <>
     <Navbar/>
    {/* main contents */}
    <div className="container auto p-10 relative mt-20">
        {/* filters */}
        <div className="flex gap-4">
   
          <select 
            className="select select-bordered "
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved Problems</option>
          </select>

         
         <select
         className="select select-bordered"
         value={filters.difficulty}
         onChange={((e) => setFilters({...filters , difficulty:e.target.value}))}
         >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
         </select>


           <select
         className="select select-bordered"
         value={filters.tag}
         onChange={((e) => setFilters({...filters , tag:e.target.value}))}
         >
            <option value="all">All Tags</option>
            <option value="Array">Array</option>
            <option value="Stack">Stack</option>
            <option value="Queue">Queue</option>
            <option value="Dp">Dp</option>
            <option value="LinkedList">Linked List</option>
         </select>
        </div>

        {/* problem list */}
        <div className="mt-5 p-2 flex flex-col justify-center">
          {
            filteredProblems.map( problem => (
              <div className="flex flex-col gap-5 h-auto ">
              <ProblemCard key={problem._id} problem={problem}/>
              </div>
            ))
          }
        </div>
    </div>
    </>
  );
};

export default Problem;
