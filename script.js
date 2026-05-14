function logActivity(msg){const log=document.getElementById('log');const ts=new Date().toLocaleString();log.textContent=ts+" — "+msg+"\n"+log.textContent;}function readTransactionFromURL(){const params=new URLSearchParams(window.location.search);let t=params.get('data')||params.get('text')||params.get('t')||null;if(!t&&window.location.hash){t=decodeURIComponent(window.location.hash.slice(1));}return t;}function showTransactionText(text){document.getElementById('txnText').textContent=text||"— no transaction text found —";}function getStored(){try{return JSON.parse(localStorage.getItem('qr_transactions_v1'))||[];}catch{return[];}}function saveStored(arr){localStorage.setItem('qr_transactions_v1',JSON.stringify(arr));}function renderStored(){const list=document.getElementById('txList');const arr=getStored();list.innerHTML="";if(!arr.length){list.innerHTML=`<div class="muted">No transactions stored.</div>`;return;}arr.slice().reverse().forEach(tx=>{const div=document.createElement("div");div.className="tx-item";div.innerHTML=`<div><strong>${tx.text}</strong></div><div class="small">Saved: ${new Date(tx.savedAt).toLocaleString()}</div><div class="small">ID: ${tx.id}</div>`;list.appendChild(div);});}function storeTransaction(text){const arr=getStored();const entry={id:"tx_"+Date.now()+"_"+Math.floor(Math.random()*9000+1000),text,savedAt:new Date().toISOString()};arr.push(entry);saveStored(arr);renderStored();logActivity("Stored transaction "+entry.id);}
// 1. Set your target location (Example: Billerica, MA)
const TARGET_LAT = 42.5584; 
const TARGET_LON = -71.2689;
const RADIUS_KM = 2; // Allow access within 2 kilometers

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function verifyLocation() {
  const withdrawBtn = document.getElementById('withdrawBtn');
  const statusMsg = document.getElementById('statusMsg');

  if (!navigator.geolocation) {
    statusMsg.textContent = "Geolocation not supported.";
    withdrawBtn.disabled = true;
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const distance = getDistance(latitude, longitude, TARGET_LAT, TARGET_LON);

    if (distance > RADIUS_KM) {
      withdrawBtn.disabled = true;
      withdrawBtn.style.background = "#ccc";
      statusMsg.textContent = "Locked: Outside authorized area.";
      logActivity(`Access denied. Distance: ${distance.toFixed(2)}km`);
    } else {
      withdrawBtn.disabled = false;
      statusMsg.textContent = "Location verified. Ready.";
      logActivity("Location verified.");
    }
  }, (error) => {
    statusMsg.textContent = "Location access denied.";
    withdrawBtn.disabled = true;
    logActivity("Geolocation error: " + error.message);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Run the geolock check
  verifyLocation();

  // Keep your existing UI logic below
  const withdrawBtn = document.getElementById('withdrawBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const manualInput = document.getElementById('manualInput');
  const useInput = document.getElementById('useInput');
  const statusMsg = document.getElementById('statusMsg');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');

  let currentText = readTransactionFromURL();
  showTransactionText(currentText);

  // ... rest of your existing event listeners ...
  renderStored();
});
