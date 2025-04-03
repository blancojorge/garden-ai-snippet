interface LocationData {
  region: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

const FALLBACK_LOCATION: LocationData = {
  region: 'Madrid',
  coordinates: {
    latitude: 40.4168,
    longitude: -3.7038
  }
}

export async function getLocation(): Promise<LocationData> {
  console.log('Starting location detection...')
  
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, using fallback location')
      resolve(FALLBACK_LOCATION)
      return
    }

    console.log('Requesting geolocation...')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('Geolocation received:', position)
          const { latitude, longitude } = position.coords
          
          // Use OpenStreetMap Nominatim API for reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
          
          if (!response.ok) {
            throw new Error('Failed to fetch location data')
          }
          
          const data = await response.json()
          console.log('Nominatim response:', data)
          
          const locationData: LocationData = {
            region: data.address.state || 'España',
            coordinates: {
              latitude,
              longitude
            }
          }
          
          console.log('Location data resolved:', locationData)
          resolve(locationData)
        } catch (error) {
          console.error('Error processing geolocation:', error)
          console.log('Using fallback location due to error')
          resolve(FALLBACK_LOCATION)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        console.log('Using fallback location due to geolocation error')
        resolve(FALLBACK_LOCATION)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
} 