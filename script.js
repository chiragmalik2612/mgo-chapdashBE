const API_BASE = "https://mgo-chapdashbe.onrender.com/api/v1/chapters/";

const getForm = document.getElementById("get-form");
const getIdForm = document.getElementById("get-id-form");
const postForm = document.getElementById("post-form");
const responseEl = document.getElementById("response");

function setLoading(isLoading) {
  if (isLoading) {
    responseEl.style.color = "gray";
    responseEl.textContent = "⏳ Loading, please wait...";
  }
}

// Handle GET request (Fetch chapters list)
getForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(getForm);
  const queryParams = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (!value) continue;

    if (key === "class") {
      queryParams.append("class", value);
    } else if (key === "weakChapters") {
      // Append only if checked (value='true')
      if (value === "true") queryParams.append("weakChapters", "true");
    } else {
      queryParams.append(key, value);
    }
  }

  const url = `${API_BASE}?${queryParams.toString()}`;

  try {
    setLoading(true);
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error fetching chapters");

    responseEl.style.color = "black";
    responseEl.textContent = formatResponse(data);
  } catch (err) {
    responseEl.style.color = "red";
    responseEl.textContent = `❌ Error: ${err.message}`;
  }
});

// Handle GET by ID request
getIdForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const chapterId = getIdForm.chapterId.value.trim();
  if (!chapterId) {
    alert("Please enter a Chapter ID");
    return;
  }

  const url = `${API_BASE}/${chapterId}`;

  try {
    setLoading(true);
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Chapter not found");

    responseEl.style.color = "black";
    responseEl.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    responseEl.style.color = "red";
    responseEl.textContent = `❌ Error: ${err.message}`;
  }
});

// Handle POST request (Upload chapters JSON)
postForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = postForm.querySelector('input[name="file"]');
  const apiKey = postForm.querySelector('input[name="apiKey"]').value.trim();

  if (!fileInput.files.length) return alert("Please select a file.");
  if (!apiKey) return alert("Please enter the API key.");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    setLoading(true);
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Upload failed");

    responseEl.style.color = "green";
    responseEl.textContent = formatResponse(data);
  } catch (err) {
    responseEl.style.color = "red";
    responseEl.textContent = `❌ Upload Error: ${err.message}`;
  }
});

// Format API response for chapters list
function formatResponse(data) {
  if (Array.isArray(data.chapters)) {
    return `✅ Total: ${data.total}\nPage: ${data.page} | Limit: ${
      data.limit
    }\n\nChapters:\n${data.chapters.map((ch) => `- ${ch.chapter}`).join("\n")}`;
  }
  return JSON.stringify(data, null, 2);
}
