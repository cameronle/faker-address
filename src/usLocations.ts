export const ALL_US_LOCATIONS = 'ALL';

export type UsLocation = {
  stateCode: string;
  state: string;
  city: string;
  postcode: string;
};

export type UsLocationFilter = {
  stateCode: string;
  city: string;
};

// Representative city/postcode pairs for synthetic UI test data. This is not a postal database.
export const usLocations: UsLocation[] = [
  { stateCode: 'AL', state: 'Alabama', city: 'Birmingham', postcode: '35203' },
  { stateCode: 'AL', state: 'Alabama', city: 'Montgomery', postcode: '36104' },
  { stateCode: 'AK', state: 'Alaska', city: 'Anchorage', postcode: '99501' },
  { stateCode: 'AK', state: 'Alaska', city: 'Fairbanks', postcode: '99701' },
  { stateCode: 'AZ', state: 'Arizona', city: 'Phoenix', postcode: '85001' },
  { stateCode: 'AZ', state: 'Arizona', city: 'Tucson', postcode: '85701' },
  { stateCode: 'AR', state: 'Arkansas', city: 'Little Rock', postcode: '72201' },
  { stateCode: 'AR', state: 'Arkansas', city: 'Fayetteville', postcode: '72701' },
  { stateCode: 'CA', state: 'California', city: 'Los Angeles', postcode: '90012' },
  { stateCode: 'CA', state: 'California', city: 'San Francisco', postcode: '94102' },
  { stateCode: 'CO', state: 'Colorado', city: 'Denver', postcode: '80202' },
  { stateCode: 'CO', state: 'Colorado', city: 'Colorado Springs', postcode: '80903' },
  { stateCode: 'CT', state: 'Connecticut', city: 'Bridgeport', postcode: '06604' },
  { stateCode: 'CT', state: 'Connecticut', city: 'Hartford', postcode: '06103' },
  { stateCode: 'DE', state: 'Delaware', city: 'Wilmington', postcode: '19801' },
  { stateCode: 'DE', state: 'Delaware', city: 'Dover', postcode: '19901' },
  { stateCode: 'FL', state: 'Florida', city: 'Miami', postcode: '33101' },
  { stateCode: 'FL', state: 'Florida', city: 'Orlando', postcode: '32801' },
  { stateCode: 'GA', state: 'Georgia', city: 'Atlanta', postcode: '30303' },
  { stateCode: 'GA', state: 'Georgia', city: 'Savannah', postcode: '31401' },
  { stateCode: 'HI', state: 'Hawaii', city: 'Honolulu', postcode: '96813' },
  { stateCode: 'HI', state: 'Hawaii', city: 'Hilo', postcode: '96720' },
  { stateCode: 'ID', state: 'Idaho', city: 'Boise', postcode: '83702' },
  { stateCode: 'ID', state: 'Idaho', city: 'Idaho Falls', postcode: '83402' },
  { stateCode: 'IL', state: 'Illinois', city: 'Chicago', postcode: '60601' },
  { stateCode: 'IL', state: 'Illinois', city: 'Springfield', postcode: '62701' },
  { stateCode: 'IN', state: 'Indiana', city: 'Indianapolis', postcode: '46204' },
  { stateCode: 'IN', state: 'Indiana', city: 'Fort Wayne', postcode: '46802' },
  { stateCode: 'IA', state: 'Iowa', city: 'Des Moines', postcode: '50309' },
  { stateCode: 'IA', state: 'Iowa', city: 'Cedar Rapids', postcode: '52401' },
  { stateCode: 'KS', state: 'Kansas', city: 'Wichita', postcode: '67202' },
  { stateCode: 'KS', state: 'Kansas', city: 'Topeka', postcode: '66603' },
  { stateCode: 'KY', state: 'Kentucky', city: 'Louisville', postcode: '40202' },
  { stateCode: 'KY', state: 'Kentucky', city: 'Lexington', postcode: '40507' },
  { stateCode: 'LA', state: 'Louisiana', city: 'New Orleans', postcode: '70112' },
  { stateCode: 'LA', state: 'Louisiana', city: 'Baton Rouge', postcode: '70801' },
  { stateCode: 'ME', state: 'Maine', city: 'Portland', postcode: '04101' },
  { stateCode: 'ME', state: 'Maine', city: 'Augusta', postcode: '04330' },
  { stateCode: 'MD', state: 'Maryland', city: 'Baltimore', postcode: '21201' },
  { stateCode: 'MD', state: 'Maryland', city: 'Annapolis', postcode: '21401' },
  { stateCode: 'MA', state: 'Massachusetts', city: 'Boston', postcode: '02108' },
  { stateCode: 'MA', state: 'Massachusetts', city: 'Worcester', postcode: '01608' },
  { stateCode: 'MI', state: 'Michigan', city: 'Detroit', postcode: '48201' },
  { stateCode: 'MI', state: 'Michigan', city: 'Grand Rapids', postcode: '49503' },
  { stateCode: 'MN', state: 'Minnesota', city: 'Minneapolis', postcode: '55401' },
  { stateCode: 'MN', state: 'Minnesota', city: 'Saint Paul', postcode: '55102' },
  { stateCode: 'MS', state: 'Mississippi', city: 'Jackson', postcode: '39201' },
  { stateCode: 'MS', state: 'Mississippi', city: 'Gulfport', postcode: '39501' },
  { stateCode: 'MO', state: 'Missouri', city: 'St. Louis', postcode: '63101' },
  { stateCode: 'MO', state: 'Missouri', city: 'Kansas City', postcode: '64101' },
  { stateCode: 'MT', state: 'Montana', city: 'Billings', postcode: '59101' },
  { stateCode: 'MT', state: 'Montana', city: 'Missoula', postcode: '59801' },
  { stateCode: 'NE', state: 'Nebraska', city: 'Omaha', postcode: '68102' },
  { stateCode: 'NE', state: 'Nebraska', city: 'Lincoln', postcode: '68508' },
  { stateCode: 'NV', state: 'Nevada', city: 'Las Vegas', postcode: '89101' },
  { stateCode: 'NV', state: 'Nevada', city: 'Reno', postcode: '89501' },
  { stateCode: 'NH', state: 'New Hampshire', city: 'Manchester', postcode: '03101' },
  { stateCode: 'NH', state: 'New Hampshire', city: 'Concord', postcode: '03301' },
  { stateCode: 'NJ', state: 'New Jersey', city: 'Newark', postcode: '07102' },
  { stateCode: 'NJ', state: 'New Jersey', city: 'Jersey City', postcode: '07302' },
  { stateCode: 'NM', state: 'New Mexico', city: 'Albuquerque', postcode: '87102' },
  { stateCode: 'NM', state: 'New Mexico', city: 'Santa Fe', postcode: '87501' },
  { stateCode: 'NY', state: 'New York', city: 'New York', postcode: '10001' },
  { stateCode: 'NY', state: 'New York', city: 'Buffalo', postcode: '14201' },
  { stateCode: 'NC', state: 'North Carolina', city: 'Charlotte', postcode: '28202' },
  { stateCode: 'NC', state: 'North Carolina', city: 'Raleigh', postcode: '27601' },
  { stateCode: 'ND', state: 'North Dakota', city: 'Fargo', postcode: '58102' },
  { stateCode: 'ND', state: 'North Dakota', city: 'Bismarck', postcode: '58501' },
  { stateCode: 'OH', state: 'Ohio', city: 'Columbus', postcode: '43215' },
  { stateCode: 'OH', state: 'Ohio', city: 'Cleveland', postcode: '44114' },
  { stateCode: 'OK', state: 'Oklahoma', city: 'Oklahoma City', postcode: '73102' },
  { stateCode: 'OK', state: 'Oklahoma', city: 'Tulsa', postcode: '74103' },
  { stateCode: 'OR', state: 'Oregon', city: 'Portland', postcode: '97201' },
  { stateCode: 'OR', state: 'Oregon', city: 'Eugene', postcode: '97401' },
  { stateCode: 'PA', state: 'Pennsylvania', city: 'Philadelphia', postcode: '19102' },
  { stateCode: 'PA', state: 'Pennsylvania', city: 'Pittsburgh', postcode: '15222' },
  { stateCode: 'RI', state: 'Rhode Island', city: 'Providence', postcode: '02903' },
  { stateCode: 'RI', state: 'Rhode Island', city: 'Warwick', postcode: '02886' },
  { stateCode: 'SC', state: 'South Carolina', city: 'Columbia', postcode: '29201' },
  { stateCode: 'SC', state: 'South Carolina', city: 'Charleston', postcode: '29401' },
  { stateCode: 'SD', state: 'South Dakota', city: 'Sioux Falls', postcode: '57104' },
  { stateCode: 'SD', state: 'South Dakota', city: 'Pierre', postcode: '57501' },
  { stateCode: 'TN', state: 'Tennessee', city: 'Nashville', postcode: '37201' },
  { stateCode: 'TN', state: 'Tennessee', city: 'Memphis', postcode: '38103' },
  { stateCode: 'TX', state: 'Texas', city: 'Houston', postcode: '77002' },
  { stateCode: 'TX', state: 'Texas', city: 'Dallas', postcode: '75201' },
  { stateCode: 'UT', state: 'Utah', city: 'Salt Lake City', postcode: '84101' },
  { stateCode: 'UT', state: 'Utah', city: 'Provo', postcode: '84601' },
  { stateCode: 'VT', state: 'Vermont', city: 'Burlington', postcode: '05401' },
  { stateCode: 'VT', state: 'Vermont', city: 'Montpelier', postcode: '05602' },
  { stateCode: 'VA', state: 'Virginia', city: 'Richmond', postcode: '23219' },
  { stateCode: 'VA', state: 'Virginia', city: 'Virginia Beach', postcode: '23451' },
  { stateCode: 'WA', state: 'Washington', city: 'Seattle', postcode: '98101' },
  { stateCode: 'WA', state: 'Washington', city: 'Spokane', postcode: '99201' },
  { stateCode: 'WV', state: 'West Virginia', city: 'Charleston', postcode: '25301' },
  { stateCode: 'WV', state: 'West Virginia', city: 'Huntington', postcode: '25701' },
  { stateCode: 'WI', state: 'Wisconsin', city: 'Milwaukee', postcode: '53202' },
  { stateCode: 'WI', state: 'Wisconsin', city: 'Madison', postcode: '53703' },
  { stateCode: 'WY', state: 'Wyoming', city: 'Cheyenne', postcode: '82001' },
  { stateCode: 'WY', state: 'Wyoming', city: 'Casper', postcode: '82601' },
];

export const usStateOptions = [...new Map(
  usLocations.map((location) => [location.stateCode, { value: location.stateCode, label: location.state }]),
).values()];

export function usCitiesForState(stateCode: string): UsLocation[] {
  return usLocations.filter((location) => location.stateCode === stateCode);
}

export function pickUsLocation(filter: UsLocationFilter): UsLocation | undefined {
  if (!filter.stateCode || filter.stateCode === ALL_US_LOCATIONS) return undefined;
  let candidates = usCitiesForState(filter.stateCode);
  if (filter.city && filter.city !== ALL_US_LOCATIONS) {
    candidates = candidates.filter((location) => location.city === filter.city);
  }
  if (!candidates.length) return undefined;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
