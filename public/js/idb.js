let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  db.createObjectStore('budget_tracker', { autoIncrement: true });
};

request.onsuccess = functione(event) {
  db = event.target.result;

  if (navigator.online) {
    // uploadFunction()
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
}

function saveRecord(record) {
  const transaction = db.transaction(['new_budget'], 'readwrite');

  const budgetStore = transaction.objectStore('new_budget');

  budgetStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(['new_budget'], 'readwrite');

  const budgetStore = transaction.objectStore('new_budget');

  const getAll = budgetStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, test/plain, */*',
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(serverResponse => {
        if (serverResponse.message) {
          throw new Error(serverResponse);
        }
        const transaction = db.transaction(['new_budget'], 'readwrite');
        const budgetStore = transaction.objectStore('new_budget');
        budgetStore.clear();

        alert('All saved transactions have been uploaded');
      })
      .catch(err => {
        console.log(err);
      });
    }
  };
}

window.addEventListener('online', uploadBudget);