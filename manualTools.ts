//just simple functions to return some data for testing purposes. In a real application, these would likely be making API calls to get real data.
export async function getCurrentWeather() {
  const weather = {
    temperature: "72",
    unit: "F",
    forecast: "sunny",
  };
  return JSON.stringify(weather);
}

export async function getLocation() {
  return "Salt Lake City, UT";
}
