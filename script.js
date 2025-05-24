const guestData = `Table Number: VIP 1
Zapanta, Lauro G.
Zapanta, Cecilia D.
Santos, Liberty
Santos, Bannie
Cervantes, Imelda
Cervantes, Santy
Table Number: VIP 2
Carpizo, Felisa P.
Carpizo, Joshua Anthony P.
Carpizo, Carlsum P.
Montallana, Nicky
Villanueva, Lucy
Villanueva, Hermy
Table Number: Table 1
Año, Samantha Laureen D.
Dueños, Hazelle Ane S.
Dueños, Hannah Mae S.
Dueños, Hanny Grace S.
Dueños, Hanniah Rose S.
Figuracion, John Glenn
Cruz, Gail Mary
Santor, Rowannie Faith
Figuracion, John Benedict
Table Number: Table 2
Zapanta, Rey Ann D.
Zapanta, Joycyn D.
Zapanta, Luiz Matthew D.
Zapanta, Reniel D.
Zapanta, Camille
Zapanta, Alexa Inah
Begonia, Rose Ann Z.
Begonia, Jonathan
Villanueva, Hailey
Table Number: Table 3
Carpizo, Shiela B.
Carpizo, Adrian P.
Carpizo, Sancho Andres B.
Carpizo, Hanah P.
Araneta, Jeffrey
Araneta, Aero Miguel
Carpizo, Angelo P.
Table Number: Table 4
Zapanta, Amiel Harry C
Carpizo, Constantine Davion
Perra, Michael Janus
Lorenzo, John Sebastian
Zapanta, Lance Patrick D.
Año, Samuel D.
Sibulo, Miguel Anthony
Table Number: Table 5
Dueños, Duane Mark
Dueños, Catherine
Cerda, Donna Rhea D.
Cerda, Steven Gilbert
Cerda, Dirk
Cerda, Deshawn
Mendoza, Dea Marie D.
Mendoza, Emil
Mendoza, Deana Emilee
Table Number: Table 6
Dueños, Dominador F.
Beltran, Concepcion D.
Beltran, Narciso
Beltran, John King D.
Beltran, Shiela
Esguerra, Janzen B.
Esguerra, Raine B.
Pulumbarit, Jhomel D.
Pulumbarit, Jericho D.
Table Number: Table 7
Ortega, Analiza D.
Ortega, Reynaldo
Dueños, Yolanda F.
Arabit, Regina
Pulumbarit, Amelia D.
Dueños, Edgardo F.
Dueños, Gina S.
Año, Rossana D.
Año, Lorenz
Table Number: Table 8
Albano, Nicole Tiffany
Baltazar, Farrah Venice
Lozada, Rosanna
Lozada, Rovic
Zapanta, Marvin
Zapanta, Jan Alfred
Zapanta, Czarina C.
Mendez, Arvin Gieo
Magallanes, Maria Cecilia
Table Number: Table 9
Jaudines, Jazlynn Rhae D.
Banua, Kalia Tyrah T.
Aurellano, Dana Jane A.
Tuazon, Ruph Aquille C.
Sabanal, Trisha
Evardone, Mariell
Vicente, Jamaica A.
Delos Santos, Marc Charles
Table Number: Table 10
Espinase, Carl Daniel M.
Gabriel, Joshua I.
Fuentes, Audrey Rose R.
Villarta, Franzylle Janoah
Encarnacion, Julyana
Salinas, Aeron Josh
Diaz, Dennise
Isabedra, Franz Calvin
Table Number: Table 11
Zapanta, Mark Lester
Mariano, Wilson A.
Francisco, Eduardo
Radam, Kristopher
Lucinario, Clarice
Alcaria, Gayzelle Anne
Nasayao, Josiel`;

const tables = {};
let currentTable = '';
let allGuests = [];
const confirmedGuests = new Set(JSON.parse(localStorage.getItem('confirmedGuests') || '[]'));
let selectedGuest = '';

// Parse guest data
guestData.split('\n').forEach(line => {
  if (!line.includes(',')) {
    currentTable = line.replace('Table Number: ', '').trim();
    tables[currentTable] = [];
  } else {
    const name = line.trim();
    if (name) {
      tables[currentTable].push(name);
      allGuests.push({ name, table: currentTable });
    }
  }
});

const nameInput = document.getElementById('nameInput');
const suggestionsBox = document.getElementById('suggestions');
const searchBtn = document.getElementById('searchBtn');
const confirmBtn = document.getElementById('confirmBtn');
const backBtn = document.getElementById('backBtn');
const adminBtn = document.getElementById('adminBtn');
const searchView = document.getElementById('searchView');
const guestView = document.getElementById('guestView');
const adminView = document.getElementById('adminView');
const tableHeading = document.getElementById('tableHeading');
const selectedNameEl = document.getElementById('selectedName');
const guestChips = document.getElementById('guestChips');
const confirmedList = document.getElementById('confirmedList');

// ✅ TEST ONLY: Reset all confirmed guests
function resetAllConfirmed() {
  if (confirm("Are you sure you want to clear all confirmed guests?")) {
    localStorage.removeItem('confirmedGuests');
    alert("All confirmed guests have been cleared.");
    location.reload();
  }
}

nameInput.addEventListener('input', () => {
  const val = nameInput.value.toLowerCase();
  suggestionsBox.innerHTML = '';
  if (!val) {
    suggestionsBox.classList.add('hidden');
    return;
  }
  const matches = allGuests.filter(g => g.name.toLowerCase().includes(val));
  matches.forEach(g => {
    const div = document.createElement('div');
    div.textContent = g.name;
    div.onclick = () => {
      nameInput.value = g.name;
      selectedGuest = g.name;
      suggestionsBox.classList.add('hidden');
    };
    suggestionsBox.appendChild(div);
  });
  suggestionsBox.classList.remove('hidden');
});

searchBtn.onclick = () => {
  const guest = allGuests.find(g => g.name === nameInput.value.trim());
  if (!guest) {
    alert('Guest not found.');
    return;
  }

  selectedGuest = guest.name;
  renderGuestInfo(guest.table, guest.name);
  searchView.classList.add('hidden');
  guestView.classList.remove('hidden');
  confirmBtn.classList.remove('hidden');

  if (confirmedGuests.has(selectedGuest)) {
    alert(`This guest is already registered at ${guest.table}.`);
    confirmBtn.disabled = true;
    confirmBtn.textContent = "Already Confirmed ✅";
  } else {
    confirmBtn.disabled = false;
    confirmBtn.textContent = "Confirm Seat";
  }
};

backBtn.onclick = () => {
  guestView.classList.add('hidden');
  adminView.classList.add('hidden');
  searchView.classList.remove('hidden');
  confirmBtn.classList.add('hidden');
  nameInput.value = '';
  suggestionsBox.innerHTML = '';
  suggestionsBox.classList.add('hidden');
};

confirmBtn.onclick = () => {
  if (!selectedGuest) return;
  confirmedGuests.add(selectedGuest);
  localStorage.setItem('confirmedGuests', JSON.stringify([...confirmedGuests]));
  const guest = allGuests.find(g => g.name === selectedGuest);
  renderGuestInfo(guest.table, guest.name);
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Confirmed ✅";
};

adminBtn.onclick = () => {
  searchView.classList.add('hidden');
  guestView.classList.add('hidden');
  adminView.classList.remove('hidden');
  confirmedList.innerHTML = '';
  [...confirmedGuests].forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    confirmedList.appendChild(li);
  });
};

function renderGuestInfo(tableName, guestName) {
  tableHeading.textContent = `You're seated at ${tableName}`;
  selectedNameEl.textContent = guestName;
  guestChips.innerHTML = '';
  tables[tableName].forEach(name => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = name.toUpperCase();
    if (name === guestName) chip.classList.add('self');
    if (confirmedGuests.has(name)) chip.classList.add('registered');
    guestChips.appendChild(chip);
  });
}

function exportCSV() {
  let csv = "Name,Table\\n";
  [...confirmedGuests].forEach(name => {
    const entry = allGuests.find(g => g.name === name);
    if (entry) csv += `${entry.name},${entry.table}\\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "confirmed_guests.csv";
  a.click();
}

// ✅ TEST-ONLY: Add Reset Button
const resetButton = document.createElement('button');
resetButton.textContent = "RESET CONFIRMATIONS";
resetButton.style.background = "#e53935";
resetButton.style.color = "white";
resetButton.style.marginLeft = "10px";
resetButton.onclick = resetAllConfirmed;
document.querySelector("footer").appendChild(resetButton);
