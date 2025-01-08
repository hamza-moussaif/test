// Fetch cars from the server
async function loadCars() {
  try {
    const response = await fetch("/cars"); // Ensure this matches the endpoint where bookings are served
    const cars = await handleResponse(response);
    renderLoadData(cars); // Pass the cars directly to renderLoadData
  } catch (error) {
    handleError(error);
  }
}

// Render cars on the page
function renderLoadData(cars) {
  const panel = document.querySelector(".services-container");
  panel.innerHTML = ""; // Clear the container before rendering

  cars.forEach((car, i) => {
    const div = document.createElement("div");
    div.className = "box";

    div.innerHTML = `
            <div class="box-img">
                <img src="${car.image}" alt="Car ${i + 1}">
            </div>
            <p>${car.model}</p>
            <h3>${car.name} ${car.model}</h3>
            <h2>$${car.price}</h2>
            <a class="btn">Rent Now</a>
            <form class="rent-form" style="display: none;">
              <input value="${car.name}" type="hidden" name="nameCar" />
              <input type="date" name="startDate" style="padding: 10px; font-size: 16px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #f9f9f9; color: #333; outline: none; transition: border-color 0.3s, box-shadow 0.3s;"
required />
              <input type="date" name="endDate" style="padding: 10px; font-size: 16px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #f9f9f9; color: #333; outline: none; transition: border-color 0.3s, box-shadow 0.3s;"
 required />
              <button type="submit" style="padding: 10px 20px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease;"
>Rent now</button>
            </form>
          `;

    const rentButton = div.querySelector(".btn");
    const rentForm = div.querySelector(".rent-form");

    rentButton.addEventListener("click", (event) => {
      event.stopPropagation();
      rentButton.style.display = "none";
      rentForm.style.display = "block";
    });

    rentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      createCarBooking(new FormData(rentForm));
      rentButton.style.display = "block";
      rentForm.style.display = "none";
    });

    panel.appendChild(div);
  });

  // Reset boxes when clicking outside
  document.addEventListener("click", (event) => {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
      const rentButton = box.querySelector(".btn");
      const rentForm = box.querySelector(".rent-form");
      if (!box.contains(event.target)) {
        rentButton.style.display = "block";
        rentForm.style.display = "none";
      }
    });
  });
}

// Handle the response and check if it's OK
function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Network response was not ok: " + response.statusText);
  }
  return response.json();
}

// Handle errors during fetching
function handleError(error) {
  console.error("Error fetching cars:", error);
  const panel = document.querySelector(".services-container");
  panel.innerHTML = `<p class="error">Failed to load cars. Please try again later.</p>`;
}

// Process form data
function createCarBooking(formData) {
  const bookingDetails = Object.fromEntries(formData.entries());
  const user = window.localStorage.getItem("user");

  console.log("User:", user);
  console.log("Booking Details:", bookingDetails);

  // Example: Send booking data to server
  fetch("/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user, ...bookingDetails }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Booking Success:", data))
    .catch((error) => console.error("Booking Error:", error));
}

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  loadCars();
});
