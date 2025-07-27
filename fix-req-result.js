const fs = require('fs');
const path = require('path');

// List of files that need to be updated based on the grep search results
const filesToUpdate = [
  'backend/src/routes/playlistRoute.js',
  'backend/src/middleware/adminMiddleware.js',
  'backend/src/controllers/videoSection.js',
  'backend/src/controllers/userProblem.js',
  'backend/src/controllers/leaderboardController.js',
  'backend/src/controllers/dashboardController.js',
  'backend/src/controllers/contestSubmissionController.js',
  'backend/src/controllers/contestController.js'
];

function updateFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace all instances of req.result with req.user
    const updatedContent = content.replace(/req\.result/g, 'req.user');
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      
      // Count the number of replacements made
      const matches = content.match(/req\.result/g);
      console.log(`   - Replaced ${matches ? matches.length : 0} instances`);
    } else {
      console.log(`⚪ No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔧 Starting req.result to req.user migration...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✨ Migration completed!');
console.log('\n⚠️  Please manually review the changes and test the affected functionality.');
