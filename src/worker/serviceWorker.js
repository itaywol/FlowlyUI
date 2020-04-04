self.addEventListener("install", function (event) {});

self.addEventListener("fetch", function (event) {
  console.log("fetching");
  return fetch(event.request);
});
