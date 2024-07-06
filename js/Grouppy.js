window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

// Other JavaScript code for handling file uploads and group creation...
let memberFileDetails = null;
let leaderFileDetails = null;
let memberFileData = [];
let leaderFileData = [];
let filesUploaded = 0; // To track the number of files uploaded

// Function to open member file picker
function openMemberFilePicker() {
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  inputElement.accept =
    ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
  inputElement.addEventListener("change", handleMemberFileSelection);
  inputElement.click();
}

// Function to open leader file picker
function openLeaderFilePicker() {
  const inputElement = document.createElement("input");
  inputElement.type = "file";
  inputElement.accept =
    ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel";
  inputElement.addEventListener("change", handleLeaderFileSelection);
  inputElement.click();
}

// Function to handle member file selection
function handleMemberFileSelection(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    memberFileDetails = selectedFile;
    document.getElementById("member-file-name").textContent = selectedFile.name;
    processMemberFile();
  }
}

// Function to handle leader file selection
function handleLeaderFileSelection(event) {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    leaderFileDetails = selectedFile;
    document.getElementById("leader-file-name").textContent = selectedFile.name;
    processLeaderFile();
  }
}

// Function to process member file
function processMemberFile() {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    memberFileData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    filesUploaded++;
    checkFilesUploaded();
  };
  reader.readAsArrayBuffer(memberFileDetails);
}

// Function to process leader file
function processLeaderFile() {
  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    leaderFileData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    filesUploaded++;
    checkFilesUploaded();
  };
  reader.readAsArrayBuffer(leaderFileDetails);
}

// Function to check if both files are uploaded
function checkFilesUploaded() {
  if (filesUploaded === 2) {
    displayFileContent();
    document.getElementById("file-name").textContent = "Groups.xlsx"; // Update file name
  }
}

// Function to display file content
function displayFileContent() {
  document
    .getElementById("file-content")
    .scrollIntoView({ behavior: "smooth" });
  document.getElementById("file-content").classList.remove("visually-hidden");
}

// Function to remove file
function removeFile() {
  document.getElementById("file-content").classList.add("visually-hidden");
  document
    .getElementById("page-top")
    .scrollIntoView({ behavior: "smooth", block: "start" });
  memberFileDetails = null; // Reset file details
  leaderFileDetails = null; // Reset file details
  memberFileData = [];
  leaderFileData = [];
  filesUploaded = 0; // Reset the file upload count
  document.getElementById("member-file-name").textContent = "";
  document.getElementById("leader-file-name").textContent = "";
}

// Function to create groups
function createGroupsAndDownload() {
  if (!memberFileDetails || !leaderFileDetails) {
    alert("Please select both member and leader files.");
    return;
  }

  // Remove leaders from the member list
  memberFileData = memberFileData.filter(
    (member) => !leaderFileData.some((leader) => leader[0] === member[0])
  );

  const shuffledMembers = shuffleArray(memberFileData);
  const shuffledLeaders = shuffleArray(leaderFileData);
  const totalGroups = shuffledLeaders.length; // Number of groups is determined by the number of leaders available
  let groups = [];

  // Create groups with one leader each
  for (let i = 0; i < totalGroups; i++) {
    let group = [shuffledLeaders[i]]; // Start the group with the leader
    groups.push(group);
  }

  // Distribute members among the groups
  let groupIndex = 0;
  for (let i = 0; i < shuffledMembers.length; i++) {
    groups[groupIndex].push(shuffledMembers[i]);
    groupIndex = (groupIndex + 1) % totalGroups;
  }

  // Find the maximum group size for row padding
  const maxGroupSize = Math.max(...groups.map((group) => group.length));

  // Prepare data for a single sheet with groups in columns
  let allGroups = [];
  for (let i = 0; i < maxGroupSize; i++) {
    let row = [];
    for (let j = 0; j < totalGroups; j++) {
      row.push(groups[j][i] || ""); // Fill with empty strings if no member
    }
    allGroups.push(row);
  }

  // Create a new workbook and worksheet
  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.aoa_to_sheet(allGroups);

  // Apply styles to the cells
  for (let col = 0; col < totalGroups; col++) {
    for (let row = 0; row < maxGroupSize; row++) {
      let cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      if (worksheet[cellAddress]) {
        if (row === 0) {
          worksheet[cellAddress].s = {
            fill: { bgColor: { rgb: "FFFF00" } }, // Yellow for leader
          };
        } else {
          worksheet[cellAddress].s = {
            fill: { fgColor: { rgb: "ADD8E6" } }, // Light Blue for members
          };
        }
      }
    }
  }

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Groups");

  // Write the workbook to a file
  XLSX.writeFile(workbook, "Groups.xlsx");
}

// Function to shuffle an array
function shuffleArray(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

document.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  const navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Scroll to top when the page is loaded
  window.scrollTo(0, 0);
});
