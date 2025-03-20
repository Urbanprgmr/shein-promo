// Load data from local storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let rewards = JSON.parse(localStorage.getItem('rewards')) || { numWinners: 0, rewardAmount: 0 };
let winners = JSON.parse(localStorage.getItem('winners')) || [];

// Pagination variables
const usersPerPage = 10; // Number of users to display per page
let currentPage = 1;

// Render users with pagination
function renderUsers() {
  const userList = document.getElementById('users');
  const searchTerm = document.getElementById('searchUser').value.toLowerCase();
  const filteredUsers = users.filter(user => user.toLowerCase().includes(searchTerm));
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Display users for the current page
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  userList.innerHTML = paginatedUsers.map(user => `
    <li>
      ${user}
      <button class="delete-btn" onclick="removeUser('${user}')">Delete</button>
    </li>
  `).join('');

  // Render pagination buttons
  renderPagination(totalPages);
}

// Render pagination buttons
function renderPagination(totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.toggle('active', i === currentPage);
    button.addEventListener('click', () => {
      currentPage = i;
      renderUsers();
    });
    pagination.appendChild(button);
  }
}

// Filter users based on search input
function filterUsers() {
  currentPage = 1; // Reset to the first page when searching
  renderUsers();
}

// Add users from textarea
function addUsers() {
  const userList = document.getElementById('userList').value;
  if (userList) {
    const newUsers = userList.split(',').map(user => user.trim()).filter(user => user);
    users = [...new Set([...users, ...newUsers])]; // Remove duplicates
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    document.getElementById('userList').value = ''; // Clear textarea
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
    const rewardMessage = document.getElementById('rewardMessage');
    rewardMessage.textContent = `${numWinners} winners will receive MVR ${rewardAmount.toFixed(2)} each.`;
  } else {
    alert('Please enter valid values for number of winners and reward amount.');
  }
}

// Draw winners with animation
function drawWinners() {
  if (users.length < rewards.numWinners) {
    alert('Not enough users to draw winners.');
    return;
  }

  const spinner = document.getElementById('spinner');
  spinner.style.display = 'block';

  setTimeout(() => {
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random()); // Shuffle users
    winners = shuffledUsers.slice(0, rewards.numWinners).map(user => ({
      name: user,
      reward: rewards.rewardAmount
    }));
    localStorage.setItem('winners', JSON.stringify(winners));
    renderWinners();
    spinner.style.display = 'none';
  }, 2000); // 2-second animation
}

// Reset winners
function resetWinners() {
  winners = [];
  localStorage.setItem('winners', JSON.stringify(winners));
  renderWinners();
}

// Toggle user list visibility
function toggleUserList() {
  const userListSection = document.getElementById('userListSection');
  userListSection.style.display = userListSection.style.display === 'none' ? 'block' : 'none';
}

// Initial render
renderUsers();
renderWinners();
