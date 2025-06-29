import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemSolve = () => {
  const [problem, setProblem] = useState(null);
  const [selectLanguage, setSelectLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  let { problemId } = useParams();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/getProblemById/${problemId}`
        );
        const initialCode = response.data.startCode.find(
          (sc) => sc.language === langMap[selectLanguage]
        ).initialCode;
        setProblem(response.data);
        console.log(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setLoading(false);
      }
    };
    console.log("Runned");
    fetchProblem();
  }, [problemId]);

  return <div>{problem?.title}</div>;
};

export default ProblemSolve;


