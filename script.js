const picklists = {
  "Laptop": {
    "Developer": ["Dell Pro 13 Plus", "HP ZBook", "Apple 14inch MacBook Pro"],
    "Business Analyst": ["Lenovo Thinkpad", "Asus Ultrabook", "HP Zbook"],
    "Executive": ["MacBook 13 inch MacBook Pro", "HP Spectre", "Dell XPS"]
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
  // ---- Laptops ----
  "Apple 14inch MacBook Pro": 271,      // ✅ Actual: Apple 14" MacBook Pro 2021 PER
  "Dell Pro 13 Plus": 109,              // ✅ Actual: Dell Pro 13 Plus PB13250 PCF report
  "HP ZBook": 120,                // ⚠️ Estimated (typical 13-14" business laptop)
  "Lenovo Thinkpad": 105,             // ⚠️ Estimated (typical ThinkPad laptop)
  "Asus Ultrabook": 95,                // ⚠️ Estimated (ultrabook range)
  "MacBook 13inch MacBook Pro": 180,            // ✅ Actual: 13" MacBook Pro M1 2020 PER
  "HP Spectre": 125,         // ⚠️ Estimated (thin premium model)
  "Dell XPS": 140,            // ⚠️ Estimated (high performance laptop)
 
  // ---- Smartphones ----
  "iPhone": 65,               // ✅ Actual: iPhone 14 ~65 kg CO₂e (Apple PER)
  "Pixel": 70,                 // ⚠️ Estimated (based on Pixel 7 class)
  "OnePlus": 60,               // ⚠️ Estimated
  "Samsung": 55,               // ⚠️ Estimated (Galaxy S series average)
  "Xiaomi": 45,                 // ⚠️ Estimated
  "Samsung Fold": 85,           // ⚠️ Estimated (larger foldable)
 
  // ---- Hard Disks ----
  "Seagate": 40,               // ⚠️ Estimated (2.5" HDD typical)
  "WD": 35,                    // ⚠️ Estimated
  "Toshiba": 38,                // ⚠️ Estimated
  "ADATA": 25,                  // ⚠️ Estimated (SSD lower impact)
 
  // ---- RAM ----
  "Corsair": 15,                 // ⚠️ Estimated
  "Kingston": 15,                // ⚠️ Estimated
  "G.Skill": 14,                  // ⚠️ Estimated
  "Crucial": 14,                  // ⚠️ Estimated
  "HyperX": 16,                   // ⚠️ Estimated
 
  // ---- Mouse ----
  "Logitech": 5,                   // ⚠️ Estimated (light peripheral)
  "Razer": 7,                      // ⚠️ Estimated
  "SteelSeries": 6                 // ⚠️ Estimated
};

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

// Set button text
deployBtn.textContent = "Save Planet";

let lastSavedEmission = 0;
let lastSelectedA = '';
let lastSelectedB = '';

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

  [...dep1.options].forEach(option => {
    option.disabled = selected2 && option.value === selected2;
  });

  [...dep2.options].forEach(option => {
    option.disabled = selected1 && option.value === selected1;
  });
}

function validateInputs() {
  if (!category.value) {
    alert("Please select a Category.");
    return false;
  }
  if (!role.value) {
    alert("Please select a Role.");
    return false;
  }
  if (!quantity.value || quantity.value <= 0) {
    alert("Please enter a valid Quantity.");
    return false;
  }
  if (!dep1.value) {
    alert("Please select Option A.");
    return false;
  }
  if (!dep2.value) {
    alert("Please select Option B.");
    return false;
  }
  if (dep1.value === dep2.value) {
    alert("Options A and B must be different.");
    return false;
  }
  return true;
}

function checkAllInputsFilled() {
  const allFilled =
    category.value &&
    role.value &&
    quantity.value &&
    quantity.value > 0 &&
    dep1.value &&
    dep2.value &&
    dep1.value !== dep2.value;

  deployBtn.style.display = allFilled ? 'block' : 'none';
}

function updateResult() {
  const qty = parseInt(quantity.value);
  const selectedCategory = category.value;
  const selectedRole = role.value;
  const selectedA = dep1.value;
  const selectedB = dep2.value;

  const emissionA = emissionValues[selectedA] || 0;
  const emissionB = emissionValues[selectedB] || 0;

  const totalA = emissionA * qty;
  const totalB = emissionB * qty;

  let winnerLine = '';
  let winnerClass = '';
  let savedEmission = 0;

  if (totalA < totalB) {
    savedEmission = totalB - totalA;
    winnerLine = `Option A (${selectedA}) wins and saves <strong>${savedEmission} units</strong> of carbon emission.`;
    winnerClass = 'winner-a';
  } else if (totalB < totalA) {
    savedEmission = totalA - totalB;
    winnerLine = `Option B (${selectedB}) wins and saves <strong>${savedEmission} units</strong> of carbon emission.`;
    winnerClass = 'winner-b';
  } else {
    winnerLine = `Both options emit the same carbon (${totalA} units).`;
    savedEmission = 0;
  }

  // Save values for sharing
  lastSavedEmission = savedEmission;
  lastSelectedA = selectedA;
  lastSelectedB = selectedB;

  resultText.innerHTML = `
    <h3>Result</h3>
    <p class="summary-line">
      <strong>Category:</strong> <span class="value">${selectedCategory}</span> 
      <strong>Role:</strong> <span class="value">${selectedRole}</span> 
      <strong>Quantity:</strong> <span class="value">${qty}</span>
    </p>

    <p><strong>Option A:</strong> <span class="value">${selectedA}</span> — Emission per unit: <span class="value">${emissionA}</span> units, Total: <span class="value">${totalA}</span> units</p>
    <p><strong>Option B:</strong> <span class="value">${selectedB}</span> — Emission per unit: <span class="value">${emissionB}</span> units, Total: <span class="value">${totalB}</span> units</p>

    <p class="${winnerClass}">${winnerLine}</p>
  `;
}

// Event listeners
category.addEventListener('change', () => {
  populateDependentDropdowns();
});

role.addEventListener('change', () => {
  populateDependentDropdowns();
});

dep1.addEventListener('change', () => {
  preventDuplicateSelections();
  checkAllInputsFilled();
});

dep2.addEventListener('change', () => {
  preventDuplicateSelections();
  checkAllInputsFilled();
});

quantity.addEventListener('input', () => {
  checkAllInputsFilled();
});

deployBtn.addEventListener('click', () => {
  if (!validateInputs()) return;

  updateResult();
  inputSection.classList.remove('show');
  inputSection.classList.add('hidden');

  resultSection.classList.remove('hidden');
  resultSection.classList.add('show');
});

prevBtn.addEventListener('click', () => {
  resultSection.classList.remove('show');
  resultSection.classList.add('hidden');

  inputSection.classList.remove('hidden');
  inputSection.classList.add('show');
});

// LinkedIn share button handler
shareBtn.addEventListener('click', () => {
  if (lastSavedEmission > 0) {
    const shareText = encodeURIComponent(
      `I just saved ${lastSavedEmission} units of carbon emission by choosing between ${lastSelectedA} and ${lastSelectedB}! #Sustainability #GreenTech`
    );

    // LinkedIn sharing URL: Note LinkedIn requires a URL, summary param is deprecated but works
    // We can pass a dummy URL or blank but it requires URL param, so let's use a generic one:
    const dummyUrl = encodeURIComponent('https://yourwebsite.com');

    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${dummyUrl}&summary=${shareText}`;

    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  } else {
    alert('No emission savings to share!');
  }
});
