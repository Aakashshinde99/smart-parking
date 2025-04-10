const channelID = '2913562';
const readAPIKey = '0HIOIXM3IV7IHIR0';
const writeAPIKey = 'GFB5393H8IJO6FAP';
const baseURL = 'https://api.thingspeak.com';

function fetchSlotStatus() {
  fetch(`${baseURL}/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=1`)
    .then(res => res.json())
    .then(data => {
      const feed = data.feeds[0];
      const slots = [
        { id: 'A1', status: feed.field1 },
        { id: 'A2', status: feed.field2 },
        { id: 'B1', status: feed.field3 },
        { id: 'B2', status: feed.field4 }
      ];
      renderSlots(slots);
    })
    .catch(err => {
      document.getElementById("status").innerText = "Error fetching slot data.";
      console.error(err);
    });
}

function renderSlots(slots) {
  document.getElementById("status").innerText = "Slot Availability";
  const container = document.getElementById("slots");
  container.innerHTML = '';
  slots.forEach(slot => {
    const div = document.createElement("div");
    div.className = `slot ${slot.status === '1' ? 'occupied' : 'available'}`;
    div.innerText = `${slot.id}\n${slot.status === '1' ? 'Occupied' : 'Available'}`;
    container.appendChild(div);
  });
}

function requestPark() {
  sendCommand('PARK');
}

function requestRetrieve() {
  sendCommand('RETRIEVE');
}

function sendCommand(cmd) {
  fetch(`${baseURL}/update?api_key=${writeAPIKey}&field5=${cmd}`)
    .then(res => res.text())
    .then(response => {
      document.getElementById("response").innerText = `Command sent: ${cmd}`;
    })
    .catch(err => {
      document.getElementById("response").innerText = "Error sending command.";
      console.error(err);
    });
}

// Update every 10s
fetchSlotStatus();
setInterval(fetchSlotStatus, 10000);
