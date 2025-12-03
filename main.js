
import { db } from "../firebase.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

function closePage() {
    window.close();
    document.body.innerHTML = "<h2>Done. You may close this page.</h2>";
}

export function saveTransaction(status, dataText) {
    const record = {
        timestamp: Date.now(),
        transactionId: crypto.randomUUID(),
        data: dataText,
        status: status
    };

    push(ref(db, "transactions"), record)
        .then(() => closePage())
        .catch(() => {
            alert("Failed to save transaction.");
            closePage();
        });
}
