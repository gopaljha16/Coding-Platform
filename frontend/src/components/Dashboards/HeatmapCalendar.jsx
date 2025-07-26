import React, { useState } from "react";

const HeatmapCalendar = ({ activity }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const generateFullYearData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const yearData = [];
    const dateMap = {};
    
    // Count submissions per day
    activity?.forEach(problem => {
      if (!problem.solvedAt) return;
      const dateStr = new Date(problem.solvedAt).toISOString().split('T')[0];
      dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });

    // Generate all days in the year with counts
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      yearData.push({
        date: dateStr,
        count: dateMap[dateStr] || 0,
        day: d.getDay(),
        month: d.getMonth(),
        displayDate: new Date(d)
      });
    }

    return yearData;
  };

  const yearData = generateFullYearData();
  const maxCount = Math.max(...yearData.map(d => d.count), 1);
  const totalSubmissions = yearData.reduce((sum, day) => sum + day.count, 0);
  const activeDays = yearData.filter(day => day.count > 0).length;

  // Group by weeks for proper rendering
  const weeks = [];
  for (let i = 0; i < Math.ceil(yearData.length / 7); i++) {
    weeks.push(yearData.slice(i * 7, (i + 1) * 7));
  }

  const getColorIntensity = (count) => {
    if (count === 0) return "bg-gray-800 border-gray-700 hover:border-gray-600";
    const intensity = Math.min(Math.floor((count / maxCount) * 4) + 1, 4);
    const colors = [
      "bg-orange-900/40 border-orange-800/60 hover:border-orange-700",
      "bg-orange-700/60 border-orange-600/70 hover:border-orange-500", 
      "bg-orange-500/80 border-orange-400/80 hover:border-orange-300",
      "bg-orange-400 border-orange-300 hover:border-orange-200"
    ];
    return colors[intensity - 1] || colors[0];
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-orange-400 mb-1">Coding Activity</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{totalSubmissions} submissions in the last year</span>
              <span>•</span>
              <span>{activeDays} active days</span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm border transition-all duration-200 ${getColorIntensity(level === 0 ? 0 : Math.ceil((level / 4) * maxCount))}`}
              />
            ))}
            <span>More</span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto pb-4">
          <div className="flex items-start min-w-full">
            {/* Day labels */}
            <div className="flex flex-col mr-3 mt-8">
              {days.map((day, i) => (
                <div key={i} className="h-3 text-xs text-gray-400 w-8 mb-1 flex items-center">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex flex-col">
              {/* Month labels */}
              <div className="flex h-6 mb-2">
                {months.map((month, i) => (
                  <div
                    key={i}
                    className="text-xs text-gray-400 font-medium"
                    style={{ width: `${(52 / 12) * 14}px` }}
                  >
                    {month}
                  </div>
                ))}
              </div>

              {/* Heatmap cells */}
              <div className="flex">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col mr-1">
                    {week.map((day, dayIndex) => {
                      const cellKey = `${weekIndex}-${dayIndex}`;
                      const isHovered = hoveredCell === cellKey;
                      
                      return (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm mb-1 border transition-all duration-200 cursor-pointer transform ${
                            getColorIntensity(day.count)
                          } ${isHovered ? 'scale-125 z-10 shadow-lg' : ''}`}
                          onMouseEnter={() => setHoveredCell(cellKey)}
                          onMouseLeave={() => setHoveredCell(null)}
                          title={`${day.displayDate.toLocaleDateString("en-US", {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-3 gap-4 text-center">
          <div className="p-2 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-bold text-orange-400">{totalSubmissions}</div>
            <div className="text-xs text-gray-400">Total Submissions</div>
          </div>
          <div className="p-2 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-bold text-green-400">{activeDays}</div>
            <div className="text-xs text-gray-400">Active Days</div>
          </div>
          <div className="p-2 bg-gray-700/30 rounded-lg">
            <div className="text-lg font-bold text-blue-400">{maxCount}</div>
            <div className="text-xs text-gray-400">Best Day</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapCalendar;