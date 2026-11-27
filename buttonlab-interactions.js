/* ButtonLab interactions */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    $("#toastMessage").textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  // Reusable button demonstrations across the gallery.
  $$("[data-toast]").forEach(button => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });

  // Confirmation dialog for destructive actions.
  const dialog = $("#confirmDialog");
  let confirmAction = null;
  $$("[data-confirm]").forEach(button => {
    button.addEventListener("click", () => {
      $("#dialogMessage").textContent = button.dataset.confirm;
      confirmAction = () => showToast(button.dataset.toast || "Action confirmed.");
      if (typeof dialog.showModal === "function") dialog.showModal();
      else if (window.confirm(button.dataset.confirm)) confirmAction?.();
    });
  });
  $("#dialogCancel").addEventListener("click", () => dialog.close());
  $("#dialogConfirm").addEventListener("click", () => {
    dialog.close();
    confirmAction?.();
    confirmAction = null;
  });

  // Loading state demo: temporarily disables itself to avoid repeat clicks.
  const loadingDemo = $("#loadingDemo");
  loadingDemo.addEventListener("click", () => {
    loadingDemo.disabled = true;
    loadingDemo.innerHTML = '<span class="spinner"></span> Processing';
    setTimeout(() => {
      loadingDemo.disabled = false;
      loadingDemo.innerHTML = 'Run process <span>↗</span>';
      showToast("Process finished successfully.");
    }, 2000);
  });

  // Add-item button demonstration.
  let addedItems = 0;
  $("#addItemButton").addEventListener("click", () => {
    addedItems += 1;
    $("#addItemButton").innerHTML = `<span class="plus-icon">＋</span> Added (${addedItems})`;
    showToast(`Item ${addedItems} added to the sample list.`);
  });

  // Toggle button helper.
  function setToggle(button, on) {
    button.setAttribute("aria-pressed", String(on));
    const text = $(".toggle-text", button);
    if (text) text.textContent = on ? "ON" : "OFF";
  }
  [$("#galleryToggle"), $("#notificationToggle")].forEach(button => {
    button.addEventListener("click", () => {
      const next = button.getAttribute("aria-pressed") !== "true";
      setToggle(button, next);
      showToast(`${button === $("#notificationToggle") ? "Notifications" : "Toggle"} turned ${next ? "ON" : "OFF"}.`);
    });
  });

  // Playground controls: size and shape update the sample buttons.
  const playgroundButtons = $("#playgroundButtons");
  $("#sizeSelect").addEventListener("change", event => {
    playgroundButtons.classList.remove("size-small", "size-large");
    if (event.target.value === "small") playgroundButtons.classList.add("size-small");
    if (event.target.value === "large") playgroundButtons.classList.add("size-large");
    setFeedback("Button size changed", `The playground is now showing ${event.target.value} buttons.`);
  });
  $$(".segment").forEach(segment => {
    segment.addEventListener("click", () => {
      $$(".segment").forEach(item => item.classList.toggle("active", item === segment));
      playgroundButtons.classList.toggle("shape-pill", segment.dataset.shape === "pill");
      setFeedback("Button shape changed", `The buttons now use a ${segment.dataset.shape} shape.`);
    });
  });

  function setFeedback(title, message) {
    $("#feedbackTitle").textContent = title;
    $("#feedbackText").textContent = message;
  }
  $("#saveDemo").addEventListener("click", () => {
    setFeedback("Changes saved", "Your sample changes have been saved successfully.");
    showToast("Changes saved successfully.");
  });
  $("#cancelDemo").addEventListener("click", () => {
    setFeedback("Action cancelled", "No changes were saved.");
    showToast("The action was cancelled.");
  });
  $("#deleteDemo").addEventListener("click", () => {
    setFeedback("Delete requested", "A real application should ask for confirmation before deleting.");
    showToast("Demo only: delete action requested.");
  });
  $("#resetPlayground").addEventListener("click", () => {
    $("#sizeSelect").value = "medium";
    playgroundButtons.className = "playground-buttons";
    $$(".segment").forEach(item => item.classList.toggle("active", item.dataset.shape === "rounded"));
    setToggle($("#notificationToggle"), true);
    setFeedback("Waiting for an action", "Your interaction feedback will appear here.");
    showToast("Playground reset.");
  });

  // Sign-up and login mini workflow.
  $("#signupDemo").addEventListener("click", () => {
    const email = $("#demoEmail").value.trim();
    const result = $("#signupResult");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      result.textContent = "Please enter a valid email address to continue.";
      result.style.color = "#F2BD68";
      $("#demoEmail").focus();
      return;
    }
    result.textContent = `Demo complete: an account flow would continue for ${email}.`;
    result.style.color = "#78C6A3";
    showToast("Example sign-up submitted.");
  });
  $("#loginDemo").addEventListener("click", () => {
    $("#signupResult").textContent = "The secondary action would take the user to the login screen.";
    $("#signupResult").style.color = "#AAB3C3";
  });

  // Task completion workflow.
  let taskComplete = false;
  $("#completeTask").addEventListener("click", () => {
    taskComplete = !taskComplete;
    $("#taskCheck").textContent = taskComplete ? "✓" : "○";
    $("#taskName").style.textDecoration = taskComplete ? "line-through" : "none";
    $("#taskName").style.color = taskComplete ? "#78C6A3" : "";
    $("#completeTask").textContent = taskComplete ? "Undo completion" : "Mark complete";
    $("#taskResult").textContent = `Task status: ${taskComplete ? "Completed" : "In progress"}`;
    showToast(taskComplete ? "Task marked complete." : "Task moved back to in progress.");
  });

  // Delete confirmation workflow.
  $("#workflowDelete").addEventListener("click", () => {
    $("#dialogMessage").textContent = "Delete Sample document.pdf? This demo action cannot be undone.";
    confirmAction = () => {
      $("#deleteResult").textContent = "Demo file deleted. In a real app, this would remove the file.";
      $("#deleteResult").style.color = "#78C6A3";
      $("#workflowDelete").disabled = true;
      $("#workflowDelete").textContent = "Deleted";
      showToast("Sample file deleted.");
    };
    if (typeof dialog.showModal === "function") dialog.showModal();
    else if (window.confirm("Delete the sample file?")) confirmAction();
  });

  // Mobile navigation.
  const menuToggle = $("#menuToggle");
  menuToggle.addEventListener("click", () => {
    const open = $(".nav-links").classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.textContent = open ? "×" : "☰";
  });
  $$(".nav-links a").forEach(link => link.addEventListener("click", () => {
    $(".nav-links").classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }));
})();
