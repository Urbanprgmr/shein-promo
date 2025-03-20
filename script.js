// Load data from local storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let rewards = JSON.parse(localStorage.getItem('rewards')) || { numWinners: 0, rewardAmount: 0 };
let winners = JSON.parse(localStorage.getItem('winners')) || [];

// Render users and winners
function renderUsers() {
  const userList = document.getElementById('users');
  userList.innerHTML = users.map(user => `
    <li>
      ${user}
      <button onclick="removeUser('${user}')">Remove</button>
    </li>
  `).join('');
}

function renderWinners() {
  const winnersList = document.getElementById('winners');
  winnersList.innerHTML = winners.map(winner => `
    <li>${winner.name} - $${winner.reward}</li>
  `).join('');
}

// Add users from textarea
function addUsers() {
  const userList = document.getElementById('userList').value;
  if (userList) {
    const newUsers = userList.split(',').map(user => user.trim()).filter(user => user);
    users = [...new Set([...users, ...newUsers])]; // Remove duplicates
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
  }
}

// Remove a user
function removeUser(user) {
  users = users.filter(u => u !== user);
  localStorage.setItem('users', JSON.stringify(users));
  renderUsers();
}

// Set rewards
function setRewards() {
  const numWinners = parseInt(document.getElementById('numWinners').value);
  const rewardAmount = parseFloat(document.getElementById('rewardAmount').value);
  if (numWinners > 0 && rewardAmount >= 0) {
    rewards = { numWinners, rewardAmount };
    localStorage.setItem('rewards', JSON.stringify(rewards));
    alert(`Rewards set: ${numWinners} winners will receive $${rewardAmount} each.`);
  } else {
    alert('Please enter valid values for number of winners and reward amount.');
  }
}

// Draw winners
function drawWinners() {
  if (users.length < rewards.numWinners) {
    alert('Not enough users to draw winners.');
    return;
  }
  const shuffledUsers = [...users].sort(() => 0.5 - Math.random()); // Shuffle users
  winners = shuffledUsers.slice(0, rewards.numWinners).map(user => ({
    name: user,
    reward: rewards.rewardAmount
  }));
  localStorage.setItem('winners', JSON.stringify(winners));
  renderWinners();
}

// Initial render
renderUsers();
renderWinners();
