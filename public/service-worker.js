self.addEventListener("install", (event) => {
  console.log("installed service worker");
});
self.addEventListener("fetch", (event) => {
  console.log("fetching");
  return fetch(event.request);
});
