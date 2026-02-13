import { appleMapsReverseGeocode } from "@/app/api/maps/reverse_geocode"

import 'cross-fetch/polyfill'

it('should find timezone via reverse geocode', async () => {
    const location = {
        lat: 44.623220118543315,
        lng: -123.25815752753397
    }
    const geocodeResult = await appleMapsReverseGeocode(location)
    expect(geocodeResult?.timeZone).toBe('America/Los_Angeles')
})