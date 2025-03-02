
// This file integrates Vercel SpeedInsights
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize SpeedInsights when the page loads
document.addEventListener('DOMContentLoaded', () => {
  injectSpeedInsights({});
  console.log('SpeedInsights initialized');
});

export default injectSpeedInsights;
