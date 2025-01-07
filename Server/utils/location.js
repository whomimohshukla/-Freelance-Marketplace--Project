const axios = require('axios');

const getLocationInfo = async (requestIp) => {
    try {
        // Use a combination of services to get accurate location
        const response = await axios.get('https://ipapi.co/json/');
        const {
            city,
            country_name: country,
            timezone,
            latitude,
            longitude,
            ip
        } = response.data;

        return {
            ip: ip || requestIp,
            city: city || 'Unknown',
            country: country || 'Unknown',
            timezone: timezone || 'Unknown',
            coordinates: {
                latitude: latitude || null,
                longitude: longitude || null
            },
            raw: response.data // Keep raw data for additional info if needed
        };
    } catch (error) {
        console.error('Error getting location:', error);
        
        // Fallback to basic IP info if the service fails
        try {
            const fallbackResponse = await axios.get(`https://ipapi.co/${requestIp}/json/`);
            const {
                city,
                country_name: country,
                timezone,
                latitude,
                longitude
            } = fallbackResponse.data;

            return {
                ip: requestIp,
                city: city || 'Unknown',
                country: country || 'Unknown',
                timezone: timezone || 'Unknown',
                coordinates: {
                    latitude: latitude || null,
                    longitude: longitude || null
                }
            };
        } catch (fallbackError) {
            console.error('Fallback location detection failed:', fallbackError);
            return {
                ip: requestIp,
                city: 'Unknown',
                country: 'Unknown',
                timezone: 'Unknown',
                coordinates: {
                    latitude: null,
                    longitude: null
                }
            };
        }
    }
};

const formatLocation = (locationInfo) => {
    if (locationInfo.city === 'Unknown' && locationInfo.country === 'Unknown') {
        return 'Location not available';
    }

    let location = '';
    
    if (locationInfo.city !== 'Unknown') {
        location += locationInfo.city;
    }
    
    if (locationInfo.country !== 'Unknown') {
        if (location) {
            location += ', ';
        }
        location += locationInfo.country;
    }

    return location || 'Location not available';
};

// Get distance between two sets of coordinates in kilometers
const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
};

// Check if a location is suspicious (e.g., login from very different location)
const isSuspiciousLocation = (prevLocation, newLocation, threshold = 1000) => {
    if (!prevLocation?.coordinates?.latitude || !newLocation?.coordinates?.latitude) {
        return false;
    }

    const distance = getDistance(
        prevLocation.coordinates.latitude,
        prevLocation.coordinates.longitude,
        newLocation.coordinates.latitude,
        newLocation.coordinates.longitude
    );

    return distance > threshold; // suspicious if more than threshold km apart
};

module.exports = {
    getLocationInfo,
    formatLocation,
    getDistance,
    isSuspiciousLocation
};
