$(document).ready(function () {
  // Category arrow toggle and page load handlers
  $(".menu a").click(function () {
    if ($(this).text().trim() === "Category") {
      $(".submenu.hidden").toggle();
      $(".menu a:contains('Category') .chevron").toggleClass("up");
      $("#members-page").hide();
      $(".category-grid").show();
      $("#breadcrumb-text").text("Home > Category");
      $("#category-title").text("Category");
      $(".search-bar").show();
      $(".button-group").addClass("hidden");
    }
  });

  // Load Members 
  $(".submenu-item[data-page='members']").click(function () {
    $(".category-grid").hide();
    $("#members-page").show();
    $("#breadcrumb-text").text("Home > Category > Members");
    $("#category-title").text("Tennis Players");
    $(".search-bar").show();
    $(".button-group").removeClass("hidden");

    // Fetch and display members
    $(document).ready(function () {
      $.getJSON("players.json", function (players) {
        const playersList = $("#players-list");
        playersList.empty();

        players.forEach((player) => {
          const row = `
          <tr>
            <td><input type="checkbox" class="player-checkbox" /></td>
            <td class="profile-row">
              <img src="${player.avatar}" alt="${player.name}" class="avatar">
              <div>
                <input type="text" value="${
                  player.name
                }" class="player-name-input" />
                <small>${player.email}</small>
              </div>
            </td>
            <td><input type="text" value="${
              player.id
            }" class="player-id-input" /></td>
            <td><input type="text" value="${
              player.birthdate
            }" class="player-birthdate-input" /></td>
            <td>
              <select class="player-status-input">
                <option value="active" ${
                  player.status === "Active" ? "selected" : ""
                }>Active</option>
                <option value="offline" ${
                  player.status === "Offline" ? "selected" : ""
                }>Offline</option>
              </select>
            </td>
            <td><button class="edit-btn">Edit User</button></td>
          </tr>
          `;
          playersList.append(row);
        });
        // Handle select all checkbox
        $("#select-all").on("change", function () {
          $(".player-checkbox").prop("checked", this.checked);
        });

        // Handle individual checkboxes
        $(document).on("change", ".player-checkbox", function () {
          if (!this.checked) {
            $("#select-all").prop("checked", false);
          } else if (
            $(".player-checkbox:checked").length ===
            $(".player-checkbox").length
          ) {
            $("#select-all").prop("checked", true);
          }
        });

        // Handle delete selected rows
        $(".delete-selected-icon").on("click", function () {
          $(".player-checkbox:checked").closest("tr").remove();
        });

        // Filter functionality
        $("#filter-name").on("input", function () {
          const filterValue = $(this).val().toLowerCase();
          $("#players-list tr").filter(function () {
            $(this).toggle(
              $(this)
                .find(".player-name-input")
                .val()
                .toLowerCase()
                .indexOf(filterValue) > -1
            );
          });
        });

        $("#filter-id").on("input", function () {
          const filterValue = $(this).val().toLowerCase();
          $("#players-list tr").filter(function () {
            $(this).toggle(
              $(this)
                .find(".player-id-input")
                .val()
                .toLowerCase()
                .indexOf(filterValue) > -1
            );
          });
        });

        $("#filter-birthdate").on("input", function () {
          const filterValue = $(this).val().toLowerCase();
          $("#players-list tr").filter(function () {
            $(this).toggle($(this).find('.player-birthdate-input').val().toLowerCase().indexOf(filterValue) > -1);
          });
        });

        $("#filter-status").on("change", function () {
          const filterValue = $(this).val();
          $("#players-list tr").filter(function () {
            $(this).toggle(
              filterValue === "" ||
                $(this).find(".player-status-input").val() === filterValue
            );
          });
        });
      });
    });
  });
});

// pagination
$(document).ready(function () {
  const membersPerPage = 8; 
  let currentPage = 1; 
  let totalMembers = 0; 

  function displayMembers(page) {
    const startIndex = (page - 1) * membersPerPage;
    let endIndex = startIndex + membersPerPage;
    if (endIndex > totalMembers) {
      endIndex = totalMembers;
    }

    const $rows = $("#players-list tr");
    $rows.hide();

    $rows.slice(startIndex, endIndex).show();
    updatePaginationInfo(startIndex + 1, endIndex, page);
  }

  function updatePaginationInfo(startIndex, endIndex, currentPage) {
    $("#pagination-details").text(`Show ${startIndex}-${endIndex} of ${totalMembers}`);

    // Disable previous button on first page
    $(".prev-btn").prop("disabled", currentPage === 1);

    // Disable next button if on last page
    const totalPages = Math.ceil(totalMembers / membersPerPage);
    $(".next-btn").prop("disabled", currentPage === totalPages || totalMembers === 0);
  }

  // Initial display
  displayMembers(currentPage);

  // Next button click handler
  $(".next-btn").click(function () {
    currentPage++;
    displayMembers(currentPage);
  });

  // Previous button click handler
  $(".prev-btn").click(function () {
    currentPage--;
    displayMembers(currentPage);
  });

  // fetch total members
  function fetchTotalMembers() {
    $.getJSON("players.json", function (players) {
      totalMembers = players.length;
      updatePaginationInfo(1, Math.min(membersPerPage, totalMembers), currentPage);
    });
  }

  fetchTotalMembers();
});


$(".category-link").click(function () {
  $("#members-page").hide();
  $(".category-grid").show();
  $("#category-title").text("Category");
  $("#breadcrumb-text").text("Home > Category");
  $(".search-bar").show();
  $(".button-group").addClass("hidden");
});

// Fetch cards dynamically
$.getJSON("categories.json", function (data) {
  var categories = data.categories;
  var categoryGrid = $("#category-grid");

  categories.forEach(function (category) {
    // Display up to 3 members' avatars
    var limitedMembers = category.members.slice(0, 3);
    var membersHtml = limitedMembers
      .map(function (member) {
        return `<img src="${member.avatar}" alt="${member.name}" title="${member.name}" />`;
      })
      .join("");
    var editIcon = `  <div class="edit-icon"><img src="./images/pencil-alt.png" alt="Edit"></div>`;

    // Calculate total members count
    var totalMembers = category.members.length;

    var cardHtml = `
          <div class="category-card" data-title="${category.title}">
             ${editIcon}
            <h3>${category.title}</h3>
            <p>${category.description}</p>
            <div class="status">
              <div class="members">${membersHtml}</div>
              <span class="member-count">${totalMembers} members</span>
              <span class="label ${
                category.status === "ONGOING" ? "ongoing" : "finished"
              }">${category.status}</span>
            </div>
          </div>
        `;

    categoryGrid.append(cardHtml);
  });
});

// Open 'Add Category' popup when clicking the add card
$(".add-card").click(function () {
  editingCategory = null;
  $("#popup-title").text("Add New Category");
  $(".save-btn").text("Save");
  $(".delete-btn").hide();
  $("#category-name").val("");
  $("#short-description").val("");
  $("#status").val("ONGOING");
  $(".overlay").fadeIn();
  $("#add-category").fadeIn();
});

// Open 'Add Member' popup
$(".add-user-btn").click(function () {
  $("#add-member-overlay").fadeIn();
  $("#add-member-popup").fadeIn();
});

// Close popup when clicking cancel button or outside the popup
$(".cancel-btn, .overlay").click(function () {
  $(".overlay").fadeOut();
  $(".popup").fadeOut();
});

$(".cancel-btn, #add-member-overlay").click(function () {
  $("#add-member-overlay").fadeOut();
  $("#add-member-popup").fadeOut();
});

// Add category and show notification
$(".save-btn").click(function () {
  var categoryName = $("#category-name").val();
  var categoryDescription = $("#short-description").val();
  var categoryStatus = $("#status").val();

  if (categoryName && categoryDescription) {
    var newCategoryHtml = `
        <div class="category-card">
          <div class="edit-icon"><img src="./images/pencil-alt.png" alt="Edit"></div>
          <h3>${categoryName}</h3>
          <p>${categoryDescription}</p>
          <div class="status">
            <div class="members"></div>
            <span class="member-count">0 members</span>
            <span class="label ${categoryStatus.toLowerCase()}">${categoryStatus}</span>
          </div>
        </div>
      `;

    if (editingCategory) {
      editingCategory.replaceWith(newCategoryHtml);
    } else {
      $("#category-grid").append(newCategoryHtml);
    }

    // Show notification
    $("#notification").fadeIn().delay(2000).fadeOut();

    // Close popup
    $(".overlay").fadeOut();
    $("#add-category").fadeOut();

    // Clear inputs
    $("#category-name").val("");
    $("#short-description").val("");
    $("#status").val("ONGOING");
  }
});

// Edit category
$(document).on("click", ".edit-icon", function () {
  editingCategory = $(this).closest(".category-card");
  var categoryName = editingCategory.find("h3").text();
  var categoryDescription = editingCategory.find("p").text();
  var categoryStatus = editingCategory.find(".label").text();

  $("#category-name").val(categoryName);
  $("#short-description").val(categoryDescription);
  $("#status").val(categoryStatus.toUpperCase());
  $("#popup-title").text("Edit Category");
  $(".save-btn").text("Save Changes");
  $(".delete-btn").show();
  $(".overlay").fadeIn();
  $("#add-category").fadeIn();
});

// Delete category
$(".delete-btn").click(function () {
  if (editingCategory) {
    editingCategory.remove();
    // Show delete notification
    $("#delete-notification").fadeIn().delay(2000).fadeOut();
    // Close popup
    $(".overlay").fadeOut();
    $("#add-category").fadeOut();
    // Clear inputs
    $("#category-name").val("");
    $("#short-description").val("");
    $("#status").val("ONGOING");
    editingCategory = null;
  }
});

// Filter categories based on search input
$(".category-search input").on("input", function () {
  var searchText = $(this).val().toLowerCase();

  $(".category-card").each(function () {
    var categoryName = $(this).find("h3").text().toLowerCase();

    if (categoryName.startsWith(searchText)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});

//add member
$(document).ready(function () {
  let avatarFile = null;
  let currentMemberId = null;

  // handle avatar file upload
  $("#avatar-upload").change(function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        $("#avatar-preview").attr("src", e.target.result);
      };
      reader.readAsDataURL(file);
      avatarFile = file;
    }
  });

  // Handle avatar update button click
  $(".update-btn").click(function () {
    $("#avatar-upload").click();
  });

  // add a new member to the table
  function addNewMember(fullName, status, id, email, birthDate, avatar) {
    const playersList = $("#players-list");

    const newRow = `
      <tr>
        <td><input type="checkbox" class="player-checkbox" /></td>
        <td class="profile-row">
          <img src="${avatar}" alt="${fullName}" class="avatar">
          <div>
            <input type="text" value="${fullName}" class="player-name-input" readonly>
            <small>${email}</small>
          </div>
        </td>
        <td><input type="text" value="${id}" class="player-id-input" readonly></td>
        <td><input type="text" value="${birthDate}" class="player-birthdate-input" readonly></td>
        <td>
          <select class="player-status-input" disabled>
            <option value="active" ${status === 'active' ? 'selected' : ''}>Active</option>
            <option value="offline" ${status === 'offline' ? 'selected' : ''}>Offline</option>
          </select>
        </td>
        <td><button class="edit-btn">Edit User</button></td>
      </tr>
    `;

    playersList.append(newRow);
    showNotification("Member added!", "success");
  }

  // update an existing member in the table
  function updateMember(fullName, status, id, email, birthDate, avatar) {
    const rowToUpdate = $(`#players-list tr .player-id-input[value='${currentMemberId}']`).closest("tr");
    
    rowToUpdate.find('.avatar').attr('src', avatar);
    rowToUpdate.find('.player-name-input').val(fullName);
    rowToUpdate.find('small').text(email);
    rowToUpdate.find('.player-id-input').val(id);
    rowToUpdate.find('.player-birthdate-input').val(birthDate);
    rowToUpdate.find('.player-status-input').val(status);
  }

  // Handle save button
  $(document).on('click', '#add-member-popup .save-btn', function () {
    const fullName = $("#full-name").val().trim();
    const status = $("#status").val().trim();
    const id = $("#id").val().trim();
    const email = $("#mail").val().trim();
    const birthDate = $("#birth-date").val().trim();
    const avatarSrc = avatarFile ? URL.createObjectURL(avatarFile) : $("#avatar-preview").attr("src");

    if (fullName && status && id && email && birthDate && avatarFile) {
      if (currentMemberId) {
        // Update existing member
        updateMember(fullName, status, id, email, birthDate, avatarSrc);
        showNotification("Member updated!", "success");
      } else {
        // Add new member
        addNewMember(fullName, status, id, email, birthDate, avatarSrc);
      }

      // Close popup and clear input fields
      $("#add-member-overlay, #add-member-popup").fadeOut();
      resetPopupFields();
    } else {
      alert("Please fill in all fields and upload an avatar.");
    }
  });

  // Handle edit button click 
  $(document).on('click', '.edit-btn', function () {
    const row = $(this).closest("tr");
    currentMemberId = row.find(".player-id-input").val();
    const fullName = row.find(".player-name-input").val();
    const status = row.find(".player-status-input").val();
    const email = row.find("small").text();
    const birthDate = row.find(".player-birthdate-input").val();
    const avatarSrc = row.find(".avatar").attr("src");

    // fields in the popup for editing
    $("#full-name").val(fullName);
    $("#status").val(status);
    $("#id").val(currentMemberId);
    $("#mail").val(email);
    $("#birth-date").val(birthDate);
    $("#avatar-preview").attr("src", avatarSrc);

    // Remove existing "Delete User" button if present
    $(".delete-user-btn").remove();

    // Change "Update" button to "Remove Photo" with red outline
    $(".update-btn").text("Remove Photo").css({"color": "red", "border-color": "red"});

    // Add "Delete User" button to the popup
    const deleteButton = $('<button class="delete-user-btn">Delete User</button>').prependTo($(".popup-buttons"));

    // Show the edit popup
    $("#add-member-overlay, #add-member-popup").fadeIn();

    // Handle delete user button click
    deleteButton.click(function () {
      row.remove(); 
      $("#add-member-overlay, #add-member-popup").fadeOut();
      resetPopupFields();
      showNotification("Member deleted!", "error");
    });
  });

  // Cancel button click handler 
  $("#add-member-popup .cancel-btn, #add-member-overlay").click(function () {
    // Close popup and clear input fields
    $("#add-member-overlay, #add-member-popup").fadeOut();
    resetPopupFields();
  });

  //  reset popup fields
  function resetPopupFields() {
    $("#full-name, #status, #id, #mail, #category, #birth-date").val('');
    $("#avatar-preview").attr("src", "./images/Frame 11.png");
    avatarFile = null;
    currentMemberId = null;
  }

  // show notification
  function showNotification(message, type) {
    const notification = $("#notification");
    notification.text(message);
    notification.removeClass().addClass("notification").addClass(type).fadeIn().delay(2000).fadeOut();
  }
});
