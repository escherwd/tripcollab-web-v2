// ## MAP UI ##
export const MAP_UI_POPOVER_MIN_HEIGHT = 450;
export const MAP_UI_POPOVER_STAY_IN_FRAME = false;
export const MAP_UI_PADDING_VALUES = {
    NAVBAR: 64,
    SEARCH_PANEL: (2 + 72 + 2) * 4, // right panel width + margins
    NAVIGATION_PANEL: (2 + 72 + 2) * 4, // left panel width + margins
    ITINERARY_PANEL: (2 + 68 + 2) * 4, // right panel width + margins
}

export const MAP_STYLES = {
    'light_simple': 'mapbox://styles/escherwd/cme0ipkvn00og01sp60vr2cjt',
    'standard': 'mapbox://styles/mapbox/standard',
    'dark_simple': 'mapbox://styles/escherwd/cme0ipkvn00og01sp60vr2cjt', // TODO
    'satellite': 'mapbox://styles/escherwd/cmjg9laiv004a01rc5ir733v2',
    'cartographer': 'mapbox://styles/escherwd/cmkqa99g0001601sof6iw47rf',
}

// ## SEARCHING ##
export const SEARCH_LOCAL_RESULTS_MAX = 5;
// Applies to search bar and route planning autocomplete
export const SEARCH_AUTOCOMPLETE_DEBOUNCE_MS = 250;

// ## ROUTE PLANNING ##
export const ROUTE_ARRIVAL_SUGGESTION_BUFFER_MINUTES = 0; // MapBox will add enough buffer time
export const ROUTE_DEPARTURE_SUGGESTION_BUFFER_MINUTES = 0;
export const ROUTE_ARRIVAL_DEFAULT_TIME_OF_DAY_MINUTES = 18 * 60; // 6 PM
export const ROUTE_DEPARTURE_DEFAULT_TIME_OF_DAY_MINUTES = 9 * 60; // 9 AM

