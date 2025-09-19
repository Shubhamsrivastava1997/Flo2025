// ----------------- Data -----------------
const picklists = {
  "Laptop": {
    "Developer": ["Dell Pro 13 Plus", "HP ZBook", "Apple 14inch MacBook Pro"],
    "Business Analyst": ["Lenovo Thinkpad", "Asus Ultrabook", "HP Zbook"],
    "Executive": ["MacBook 13inch MacBook Pro", "HP Spectre", "Dell XPS"]
  },
  "Mobile": {
    "Developer": ["Pixel", "OnePlus", "iPhone"],
    "Business Analyst": ["Samsung", "Xiaomi", "OnePlus"],
    "Executive": ["iPhone", "Samsung Fold", "Pixel"]
  },
  "Hard Disk": {
    "Developer": ["Seagate", "WD", "Toshiba"],
    "Business Analyst": ["Samsung", "ADATA"],
    "Executive": ["WD", "Seagate", "ADATA"]
  },
  "RAM": {
    "Developer": ["Corsair", "Kingston"],
    "Business Analyst": ["G.Skill", "Crucial"],
    "Executive": ["HyperX", "Corsair"]
  },
  "Mouse": {
    "Developer": ["Logitech", "Razer"],
    "Business Analyst": ["HP", "Corsair"],
    "Executive": ["SteelSeries", "Logitech"]
  }
};

const emissionValues = {
  "Apple 14inch MacBook Pro": 271,
  "Dell Pro 13 Plus": 109,
  "HP ZBook": 120,
  "Lenovo Thinkpad": 105,
  "Asus Ultrabook": 95,
  "MacBook 13inch MacBook Pro": 180,
  "HP Spectre": 125,
  "Dell XPS": 140,
  "iPhone": 65,
  "Pixel": 70,
  "OnePlus": 60,
  "Samsung": 55,
  "Xiaomi": 45,
  "Samsung Fold": 85,
  "Seagate": 40,
  "WD": 35,
  "Toshiba": 38,
  "ADATA": 25,
  "Corsair": 15,
  "Kingston": 15,
  "G.Skill": 14,
  "Crucial": 14,
  "HyperX": 16,
  "Logitech": 5,
  "Razer": 7,
  "SteelSeries": 6
};

const costValues = {
  "Apple 14inch MacBook Pro": 2000,
  "Dell Pro 13 Plus": 1500,
  "HP ZBook": 1600,
  "Lenovo Thinkpad": 1400,
  "Asus Ultrabook": 1300,
  "MacBook 13inch MacBook Pro": 1800,
  "HP Spectre": 1550,
  "Dell XPS": 1700,
  "iPhone": 1000,
  "Pixel": 900,
  "OnePlus": 800,
  "Samsung": 850,
  "Xiaomi": 600,
  "Samsung Fold": 1500,
  "Seagate": 100,
  "WD": 90,
  "Toshiba": 95,
  "ADATA": 80,
  "Corsair": 70,
  "Kingston": 65,
  "G.Skill": 60,
  "Crucial": 55,
  "HyperX": 75,
  "Logitech": 40,
  "Razer": 50,
  "SteelSeries": 45
};

// ----------------- DOM Elements -----------------
const category = document.getElementById('category');
const role = document.getElementById('role');
const quantity = document.getElementById('quantity');
const dep1 = document.getElementById('dep1');
const dep2 = document.getElementById('dep2');
const dep1Label = document.getElementById('dep1-label');
const dep2Label = document.getElementById('dep2-label');

const deployBtn = document.getElementById('deployBtn');
const prevBtn = document.getElementById('prevBtn');
const shareBtn = document.getElementById('shareBtn');

const inputSection = document.getElementById('input-section');
const resultSection = document.getElementById('result-section');
const resultText = document.getElementById('result-text');

const shareSection = document.getElementById('share-section');
const shareContent = document.getElementById('shareContent');
const copyBtn = document.getElementById('copyBtn');
const backBtn = document.getElementById('backBtn');
const openLinkedInBtn = document.getElementById('openLinkedInBtn');

// ----------------- State -----------------
let lastSavedEmission = 0;
let lastSelectedA = '';
let lastSelectedB = '';

// ----------------- Functions -----------------
function populateDependentDropdowns() {
  const selectedCategory = category.value;
  const selectedRole = role.value;

  dep1Label.textContent = `${selectedCategory || 'Option'} A`;
  dep2Label.textContent = `${selectedCategory || 'Option'} B`;

  const options = picklists[selectedCategory]?.[selectedRole] || [];

  dep1.innerHTML = '<option value="">--Select--</option>';
  dep2.innerHTML = '<option value="">--Select--</option>';

  options.forEach(item => {
    const opt1 = document.createElement('option');
    opt1.value = item;
    opt1.textContent = item;
    dep1.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = item;
    opt2.textContent = item;
    dep2.appendChild(opt2);
  });

  preventDuplicateSelections();
  checkAllInputsFilled();
}

function preventDuplicateSelections() {
  const selected1 = dep1.value;
  const selected2 = dep2.value;

  [...dep1.options].forEach(option => option.disabled = selected2 && option.value === selected2);
  [...dep2.options].forEach(option => option.disabled = selected1 && option.value === selected1);
}

function validateInputs() {
  if (!category.value) { alert("Please select a Category."); return false; }
  if (!role.value) { alert("Please select a Role."); return false; }
  if (!quantity.value || quantity.value <= 0) { alert("Please enter a valid Quantity."); return false; }
  if (!dep1.value) { alert("Please select Option A."); return false; }
  if (!dep2.value) { alert("Please select Option B."); return false; }
  if (dep1.value === dep2.value) { alert("Options A and B must be different."); return false; }
  return true;
}

function checkAllInputsFilled() {
  const allFilled =
    category.value && role.value &&
    quantity.value && quantity.value > 0 &&
    dep1.value && dep2.value &&
    dep1.value !== dep2.value;

  deployBtn.style.display = allFilled ? 'block' : 'none';
}

function updateResult() {
  const qty = parseInt(quantity.value);
  const selectedA = dep1.value;
  const selectedB = dep2.value;

  const emissionA = emissionValues[selectedA] || 0;
  const emissionB = emissionValues[selectedB] || 0;
  const costA = costValues[selectedA] || 0;
  const costB = costValues[selectedB] || 0;

  const totalAEmission = emissionA * qty;
  const totalBEmission = emissionB * qty;
  const totalACost = costA * qty;
  const totalBCost = costB * qty;

  let winnerOption = '';
  let emissionSaved = 0;

  if (totalAEmission < totalBEmission) {
    winnerOption = `Option A (${selectedA})`;
    emissionSaved = totalBEmission - totalAEmission;
  } else if (totalBEmission < totalAEmission) {
    winnerOption = `Option B (${selectedB})`;
    emissionSaved = totalAEmission - totalBEmission;
  } else {
    winnerOption = `Both options emit the same CO₂`;
    emissionSaved = 0;
  }

  let costLine = '';
  if (totalACost < totalBCost) {
    costLine = `Option A (${selectedA}) is cheaper by $${totalBCost - totalACost}`;
  } else if (totalBCost < totalACost) {
    costLine = `Option B (${selectedB}) is cheaper by $${totalACost - totalBCost}`;
  } else {
    costLine = `Both options cost the same ($${totalACost})`;
  }

  // CO2 absorbed per tree per year
  const TREE_CO2_ABSORPTION = 21; 
  const treesEquivalent = emissionSaved / TREE_CO2_ABSORPTION;

  lastSavedEmission = emissionSaved;
  lastSelectedA = selectedA;
  lastSelectedB = selectedB;

  resultText.innerHTML = `
    <h3 style="color:#00ff00;">Result</h3>
    <table border="1" style="width:100%; text-align:center; border-collapse: collapse;">
      <thead style="color:#00ff00;">
        <tr>
          <th>Option</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Emission/unit</th>
          <th>Total Emission</th>
          <th>Cost/unit ($)</th>
          <th>Total Cost ($)</th>
        </tr>
      </thead>
      <tbody style="color:#ffffff;">
        <tr>
          <td>A</td>
          <td>${selectedA}</td>
          <td>${qty}</td>
          <td>${emissionA}</td>
          <td>${totalAEmission}</td>
          <td>${costA}</td>
          <td>${totalACost}</td>
        </tr>
        <tr>
          <td>B</td>
          <td>${selectedB}</td>
          <td>${qty}</td>
          <td>${emissionB}</td>
          <td>${totalBEmission}</td>
          <td>${costB}</td>
          <td>${totalBCost}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top:1rem; font-weight:700; color:#00ff00;">Winner: ${winnerOption}</p>
    <p style="color:#ffffff;">
      CO₂ Emission Saved: ${emissionSaved} units
    </p>
    <p style="color:#ffffff;">${costLine}</p>
    <p style="margin-top: 0.5rem; font-weight: 700; color: #FFA500; 
      background-color: rgba(255, 165, 0, 0.15); padding: 0.5rem 1rem; border-radius: 8px;">
      Equivalent to planting approximately ${treesEquivalent.toFixed(2)} trees per year
    </p>
  `;
}


// ----------------- Event Listeners -----------------
category.addEventListener('change', populateDependentDropdowns);
role.addEventListener('change', populateDependentDropdowns);
dep1.addEventListener('change', () => { preventDuplicateSelections(); checkAllInputsFilled(); });
dep2.addEventListener('change', () => { preventDuplicateSelections(); checkAllInputsFilled(); });
quantity.addEventListener('input', checkAllInputsFilled);

deployBtn.addEventListener('click', () => {
  if (!validateInputs()) return;
  updateResult();

  // Show result, hide others
  inputSection.classList.add('hidden'); inputSection.classList.remove('show');
  resultSection.classList.remove('hidden'); resultSection.classList.add('show');
  shareSection.classList.add('hidden'); shareSection.classList.remove('show');
});

prevBtn.addEventListener('click', () => {
  resultSection.classList.add('hidden'); resultSection.classList.remove('show');
  shareSection.classList.add('hidden'); shareSection.classList.remove('show');
  inputSection.classList.remove('hidden'); inputSection.classList.add('show');
});

shareBtn.addEventListener('click', () => {
  // Prepare default post content
  const defaultText = `I just saved ${lastSavedEmission} units of CO₂ emissions by choosing between ${lastSelectedA} and ${lastSelectedB}! #Sustainability #GreenTech`;
  shareContent.innerText = defaultText;

  inputSection.classList.add('hidden'); inputSection.classList.remove('show');
  resultSection.classList.add('hidden'); resultSection.classList.remove('show');
  shareSection.classList.remove('hidden'); shareSection.classList.add('show');
});

backBtn.addEventListener('click', () => {
  shareSection.classList.add('hidden'); shareSection.classList.remove('show');
  inputSection.classList.add('hidden'); inputSection.classList.remove('show');
  resultSection.classList.remove('hidden'); resultSection.classList.add('show');
});

copyBtn.addEventListener('click', () => {
  const text = shareContent.innerText;
  navigator.clipboard.writeText(text).then(() => {
    // Create or reuse confirmation message
    let msg = document.getElementById('copyMsg');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'copyMsg';
      msg.style.position = 'absolute';
      msg.style.top = '10px';
      msg.style.right = '10px';
      msg.style.padding = '0.5rem 1rem';
      msg.style.backgroundColor = 'green';
      msg.style.color = '#fff';
      msg.style.borderRadius = '5px';
      msg.style.fontWeight = '700';
      msg.style.zIndex = '1000';
      msg.style.opacity = '0';
      msg.style.transition = 'opacity 0.5s ease';
      document.body.appendChild(msg);
    }

    msg.textContent = 'Copied!';
    msg.style.opacity = '1';

    // Hide after 2 seconds
    setTimeout(() => {
      msg.style.opacity = '0';
    }, 2000);
  });
});


openLinkedInBtn.addEventListener('click', () => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://yourwebsite.com')}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=600');
});
// ECO Idea link click opens new tab with single input form
document.getElementById('ecoIdeaLink').addEventListener('click', (e) => {
  e.preventDefault();

  const ecoPageHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>ECO Idea</title>
      <style>
        body {
          font-family: 'Orbitron', sans-serif;
          background: #0a0a0a;
          color: #00e0ff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          padding: 2rem;
        }
        .form-section {
          background: rgba(20, 20, 30, 0.9);
          padding: 2rem 3rem;
          border-radius: 15px;
          box-shadow: 0 0 30px rgba(0, 224, 255, 0.5);
          width: 90%;
          max-width: 400px;
          border: 2px solid #00e0ff;
          text-align: center;
        }
        label {
          font-weight: 600;
          font-size: 1.2rem;
          display: block;
          margin-bottom: 0.7rem;
          color: #00caff;
        }
        input[type=number] {
          width: 100%;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1px solid #006b8f;
          background: #1a1a2e;
          color: #00e0ff;
          font-size: 1.1rem;
          outline: none;
          box-shadow: inset 0 0 10px rgba(0, 224, 255, 0.3);
          transition: all 0.3s ease;
        }
        input[type=number]:focus {
          background: #2a2a46;
          border-color: #00e0ff;
          box-shadow: 0 0 15px rgba(0, 224, 255, 0.6), inset 0 0 15px rgba(0, 224, 255, 0.4);
        }
        button {
          margin-top: 1.5rem;
          padding: 1rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #00e0ff, #006b8f);
          color: #000;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          text-transform: uppercase;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(0, 224, 255, 0.5);
          width: 100%;
        }
        button:hover {
          background: linear-gradient(90deg, #006b8f, #00e0ff);
          box-shadow: 0 0 30px rgba(0, 224, 255, 0.8);
          transform: translateY(-2px);
        }
        #result {
          margin-top: 1.5rem;
          font-weight: 700;
          color: #00ff00;
        }
      </style>
    </head>
    <body>
      <section class="form-section">
        <h2>ECO Idea</h2>
        <label for="numLaptop">No of laptop</label>
        <input type="number" id="numLaptop" min="0" placeholder="Enter quantity" />
        <button id="calcBtn">Calculate Emission Saved</button>
        <div id="result"></div>
      </section>
      <script>
        const emissionPerLaptop = 109; // example emission value
        
        document.getElementById('calcBtn').addEventListener('click', () => {
          const qty = parseInt(document.getElementById('numLaptop').value);
          const resultDiv = document.getElementById('result');

          if (!qty || qty <= 0) {
            resultDiv.textContent = 'Please enter a valid quantity.';
            resultDiv.style.color = '#ff3300';
            return;
          }

          const totalEmission = qty * emissionPerLaptop;
          resultDiv.style.color = '#00ff00';
          resultDiv.textContent = \`Total CO₂ emission for \${qty} laptops: \${totalEmission} units.\`;
        });
      </script>
    </body>
    </html>
  `;

  const newWindow = window.open();
  newWindow.document.write(ecoPageHTML);
  newWindow.document.close();
});
