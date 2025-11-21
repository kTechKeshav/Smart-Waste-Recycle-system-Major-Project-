console.log("Script loaded");

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const predictedLabel = document.getElementById("predictedLabel");
const confidenceBars = document.getElementById("confidenceBars");
const suggestion = document.getElementById("suggestion");

// Preview image
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
});

// Click Predict
predictBtn.addEventListener("click", async (event) => {
      event.preventDefault();  // STOP BROWSER FROM REFRESHING
  
      const file = imageInput.files[0];
      if (!file) {
          alert("Please select an image first!");
          return;
      }
  
      loading.classList.remove("hidden");
      resultBox.classList.add("hidden");
  
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await fetch("/predict", {
          method: "POST",
          body: formData
      });
  
      const data = await response.json();
      loading.classList.add("hidden");
  
      if (data.error) {
          alert("Error: " + data.error);
          return;
      }
  
      const pred = data.prediction;
  
      predictedLabel.innerHTML = `<strong>Detected:</strong> ${pred.label.toUpperCase()} (${(pred.confidence * 100).toFixed(2)}%)`;
  
      confidenceBars.innerHTML = "";
      pred.top.forEach(item => {
          confidenceBars.innerHTML += `
              <div class="conf-bar">
                  <span>${item.label.toUpperCase()} (${(item.confidence * 100).toFixed(2)}%)</span>
                  <div class="progress">
                      <div class="progress-inner" style="width: ${(item.confidence * 100)}%"></div>
                  </div>
              </div>
          `;
      });
  
      const suggestions = {
          plastic: "Dispose in PLASTIC recycling bin. Rinse before recycling.",
          paper: "Recycle as PAPER. Avoid recycling if soaked or greasy.",
          glass: "Place in GLASS recycling bin. Remove lids.",
          metal: "Recycle in METAL bin. Aluminum cans are highly recyclable.",
          cardboard: "Flatten the cardboard before recycling.",
          trash: "This item cannot be recycled. Dispose in general waste."
      };
  
      suggestion.innerText = suggestions[pred.label] || "No suggestion available.";
  
      resultBox.classList.remove("hidden");
  });
  
