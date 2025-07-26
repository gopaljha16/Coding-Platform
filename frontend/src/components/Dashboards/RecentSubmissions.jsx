const RecentSubmissions = ({ submissions }) => {
  return (
    <div className="bg-dark-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-orange-primary">Recent Submissions</h3>
      <div className="space-y-3">
        {submissions.map((problem) => (
          <div key={problem._id} className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
            <div>
              <p className="font-medium">{problem.title}</p>
              <p className="text-sm text-gray-400">
                Solved on {new Date(problem.solvedAt).toLocaleDateString()}
              </p>
            </div>
            <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded text-xs">
              Accepted
            </span>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="text-gray-400">No submissions yet</p>
        )}
      </div>
    </div>
  );
};

export default RecentSubmissions;