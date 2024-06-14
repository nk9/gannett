export const zoomThreshold = 12;
export const zoomDuration = 1200;
export const initialViewState = {
    center: [-98, 40], // long, lat
    longitude: -98,
    latitude: 40,
    zoom: 3.5
}
export const zoomLevel = { 'district': 14, 'road': 15, 'metro': 13 }

export const ALL_YEARS = [1880, 1900, 1910, 1920, 1930, 1940];


export const USStates = {
    'AL': 'Alabama',
    'AK': 'Alaska',
    'AZ': 'Arizona',
    'AR': 'Arkansas',
    'CA': 'California',
    'CO': 'Colorado',
    'CT': 'Connecticut',
    'DE': 'Delaware',
    'DC': 'District of Columbia',
    'FL': 'Florida',
    'GA': 'Georgia',
    'HI': 'Hawaii',
    'ID': 'Idaho',
    'IL': 'Illinois',
    'IN': 'Indiana',
    'IA': 'Iowa',
    'KS': 'Kansas',
    'KY': 'Kentucky',
    'LA': 'Louisiana',
    'ME': 'Maine',
    'MD': 'Maryland',
    'MA': 'Massachusetts',
    'MI': 'Michigan',
    'MN': 'Minnesota',
    'MS': 'Mississippi',
    'MO': 'Missouri',
    'MT': 'Montana',
    'NE': 'Nebraska',
    'NV': 'Nevada',
    'NH': 'New Hampshire',
    'NJ': 'New Jersey',
    'NM': 'New Mexico',
    'NY': 'New York',
    'NC': 'North Carolina',
    'ND': 'North Dakota',
    'OH': 'Ohio',
    'OK': 'Oklahoma',
    'OR': 'Oregon',
    'PA': 'Pennsylvania',
    'RI': 'Rhode Island',
    'SC': 'South Carolina',
    'SD': 'South Dakota',
    'TN': 'Tennessee',
    'TX': 'Texas',
    'UT': 'Utah',
    'VT': 'Vermont',
    'VA': 'Virginia',
    'WA': 'Washington',
    'WV': 'West Virginia',
    'WI': 'Wisconsin',
    'WY': 'Wyoming'
}

export const resourceFormats = {
    ANC: {
        CENSUS: {
            title: "Ancestry",
            format: "https://www.ancestry.com/imageviewer/collections/%(dbid)i/images/%(iid)s"
        }
    },
    FS: {
        CENSUS: {
            title: "Family Search",
            format: "https://www.familysearch.org/ark:/61903/%(ark)s"
        }
    }
}
