
// This file integrates Vercel SpeedInsights
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize SpeedInsights when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Speed Insights
  injectSpeedInsights({
    // You can add configuration options here if needed
    // debug: true,
  });
  console.log('SpeedInsights initialized');
});
