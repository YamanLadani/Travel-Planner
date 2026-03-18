// AI Recommendations - Simple implementation
// In production, integrate with OpenAI or similar service

export const getRecommendations = async (req, res) => {
  try {
    const { preferences } = req.body

    // Mock recommendations based on preferences
    const recommendations = [
      {
        id: 1,
        title: 'Historic City Tour',
        description: 'Explore ancient monuments and historical landmarks',
        confidence: 0.95,
        category: 'Historical'
      },
      {
        id: 2,
        title: 'Nature Hiking Adventure',
        description: 'Experience breathtaking mountain trails and nature walks',
        confidence: 0.88,
        category: 'Nature'
      },
      {
        id: 3,
        title: 'Culinary Food Tour',
        description: 'Taste authentic local cuisine and street food',
        confidence: 0.92,
        category: 'Food'
      }
    ]

    return res.status(200).json({
      recommendations,
      lastUpdated: new Date(),
      preferences: preferences || {}
    })
  } catch (error) {
    console.error('Get recommendations error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
