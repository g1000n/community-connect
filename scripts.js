"use strict";

const baseURL = "http://localhost:3000"; // Base URL of your local server

document.addEventListener("DOMContentLoaded", () => {
  // Login
  document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", loginUser);
    }
  });

  async function loginUser(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    alert("Login pressed");

    try {
      const response = await fetch(`${baseURL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        // Redirect to homepage after successful login
        window.location.href = "/";
      } else {
        const data = await response.json();
        console.error("Login error:", data.error);
        alert("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again later.");
    }
  }

  // Creating community

  let currentCommunityId = null;

  const createCommunityButton = document.getElementById(
    "create-community-button"
  );
  if (createCommunityButton) {
    createCommunityButton.addEventListener("click", redirectToCreateCommunity);
  }

  // Function to handle clicking the "Create Community" button
  function redirectToCreateCommunity() {
    window.location.href = "/public/create-community.html";
  }

  // Function to handle form submission for creating a community
  async function createCommunityAndAdmin(event) {
    event.preventDefault();
    const communityName = document.getElementById("community-name").value;
    const communityAddress = document.getElementById("community-address").value;
    const communityContact = document.getElementById("community-contact").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validate password
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Create Community
      const communityResponse = await fetch(`${baseURL}/api/create-community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          communityName,
          communityAddress,
          communityContact,
        }),
      });

      const communityData = await communityResponse.json();
      if (communityResponse.status !== 200) {
        console.error("Error creating community:", communityData.error);
        alert("Error creating community. Please try again.");
        return;
      }

      const communityId = communityData.communityId;

      // Create Admin User
      const userResponse = await fetch(`${baseURL}/api/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          communityId, // Include the community ID when creating the user
        }),
      });

      const userData = await userResponse.json();
      if (userResponse.status !== 200) {
        console.error("Error creating user/admin:", userData.error);
        alert("Error creating user/admin. Please try again.");
        return;
      }

      alert("Community and Admin created successfully!");
      // Redirect to homepage after successful creation
      window.location.href = "/public/index.html";
    } catch (error) {
      console.error("Error creating community and user/admin:", error);
      alert("Error creating community and user/admin. Please try again.");
    }
  }

  // Form submission event listener for creating a community and an admin
  const combinedForm = document.getElementById("combined-form");
  if (combinedForm) {
    combinedForm.addEventListener("submit", createCommunityAndAdmin);
  }

  // For the home page welcome
  document.addEventListener("DOMContentLoaded", () => {
    const communityName = "Your Community Name"; // Replace this with the actual community name
    const greetingElement = document.getElementById("community-greeting");
    greetingElement.textContent = `Hello ${communityName}!`;
  });
});
