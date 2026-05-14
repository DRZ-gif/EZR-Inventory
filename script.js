function logActivity(msg){const log=document.getElementById('log');const ts=new Date().toLocaleString();log.textContent=ts+" — "+msg+"\n"+log.textContent;}function readTransactionFromURL(){const params=new URLSearchParams(window.location.search);let t=params.get('data')||params.get('text')||params.get('t')||null;if(!t&&window.location.hash){t=decodeURIComponent(window.location.hash.slice(1));}return t;}function showTransactionText(text){document.getElementById('txnText').textContent=text||"— no transaction text found —";}function getStored(){try{return JSON.parse(localStorage.getItem('qr_transactions_v1'))||[];}catch{return[];}}function saveStored(arr){localStorage.setItem('qr_transactions_v1',JSON.stringify(arr));}function renderStored(){const list=document.getElementById('txList');const arr=getStored();list.innerHTML="";if(!arr.length){list.innerHTML=`<div class="muted">No transactions stored.</div>`;return;}arr.slice().reverse().forEach(tx=>{const div=document.createElement("div");div.className="tx-item";div.innerHTML=`<div><strong>${tx.text}</strong></div><div class="small">Saved: ${new Date(tx.savedAt).toLocaleString()}</div><div class="small">ID: ${tx.id}</div>`;list.appendChild(div);});}function storeTransaction(text){const arr=getStored();const entry={id:"tx_"+Date.now()+"_"+Math.floor(Math.random()*9000+1000),text,savedAt:new Date().toISOString()};arr.push(entry);saveStored(arr);renderStored();logActivity("Stored transaction "+entry.id);}
// 1. Set target coordinates (Example: Billerica, MA)
const TARGET_LAT = 42.593492; 
const TARGET_LON = --71.150348;
const RADIUS_KM = 1.0; // 1 kilometer allowance

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function showAccessDenied(reason) {
  document.body.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; font-family:system-ui; background:#f4f6f8; color:#0b1320; padding:20px;">
      <div style="font-size:64px; margin-bottom:20px;">🚫</div>
      <h1 style="font-size:28px; margin:0 0 10px;">Access Denied</h1>
      <p style="color:#536070; max-width:400px; line-height:1.5;">
        ${reason}<br><br>
        This inventory tool is geolocked to authorized facilities only.
      </p>
      <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; border-radius:8px; border:1px solid #d9e2ef; cursor:pointer; font-weight:600;">Retry Connection</button>
    </div>`;
}

function verifyLocation(callback) {
  if (!navigator.geolocation) {
    showAccessDenied("Geolocation is not supported by this browser.");
    return;
  }

  // Show a "Verifying..." state while waiting for GPS
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = '<div style="display:flex; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">Verifying location...</div>';

  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    const distance = getDistance(latitude, longitude, TARGET_LAT, TARGET_LON);

    if (distance > RADIUS_KM) {
      showAccessDenied(`You are outside the authorized zone (${distance.toFixed(2)} km away).`);
    } else {
      // Restore content and initialize app
      document.body.innerHTML = originalContent;
      callback(); 
    }
  }, (error) => {
    showAccessDenied("Location access is required to use this tool. Please enable GPS permissions.");
  }, { enableHighAccuracy: true });
}

document.addEventListener('DOMContentLoaded', () => {
  verifyLocation(() => {
    // This callback runs only if location is verified
    initializeApp();
  });
});

function initializeApp() {
    // Your existing UI initialization logic here
    const withdrawBtn = document.getElementById('withdrawBtn');
    // ... rest of your original event listeners and render functions
    renderStored();
    logActivity("Location verified. Session started.");
}
