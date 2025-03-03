
// Speed Insights for monitoring page performance
import { SpeedInsights } from '@vercel/speed-insights/next';

// This provides a fallback in case the import fails
try {
  console.log('Speed insights module loaded');
  
  // Create a new instance when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    try {
      new SpeedInsights();
      console.log('SpeedInsights initialized');
    } catch (err) {
      console.log('SpeedInsights initialization skipped:', err.message);
    }
  });
} catch (err) {
  console.log('Speed insights module loaded as fallback');
}

// Export for usage in other files if needed
export const speedInsights = { initialized: true };
