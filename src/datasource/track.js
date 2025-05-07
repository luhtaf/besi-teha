// Mock track data
const mockTracks = [
  {
    id: '1',
    title: 'Introduction to GraphQL',
    author: 'John Doe',
    length: 240,
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive',
    author: 'Jane Smith',
    length: 320,
  },
  {
    id: '3',
    title: 'Node.js Best Practices',
    author: 'Dev Team',
    length: 280,
  }
];

/**
 * Get a track by ID from the mock data
 * @param {string} id - Track ID
 * @returns {Object|null} Track object or null if not found
 */
function getTrackById(id) {
  return mockTracks.find(track => track.id === id) || null;
}

function getTracks() {
    return mockTracks;
}

module.exports = {
  getTrackById,
  getTracks
};