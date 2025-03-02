document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3019/get_user")
        .then(response => response.json())
        .then(user => {
            document.getElementById("userName").innerText = user.name;
            document.getElementById("newName").value = user.name;
            document.getElementById("newEmail").value = user.email;
            document.getElementById("newPhone").value = user.phno;
            document.getElementById("newBloodGroup").value = user.bloodGroup;
            document.getElementById("newAge").value = user.age;
            document.getElementById("newDiet").value = user.diet;
        });

            document.getElementById("editProfileForm").addEventListener("submit", function (event) {
                event.preventDefault();
                fetch("http://localhost:3019/update_profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: document.getElementById("newName").value,
                        email: document.getElementById("newEmail").value,
                        phno: document.getElementById("newPhone").value,
                        bloodGroup: document.getElementById("newBloodGroup").value,
                        age: document.getElementById("newAge").value,
                        diet: document.getElementById("newDiet").value
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    closeProfilePopup();
                })
                .catch(error => console.error("Error updating profile:", error));
            });
        });

        // ✅ Open & Close Profile Popup
        function openProfilePopup() {
            document.getElementById("profilePopup").style.display = "block";
        }
        function closeProfilePopup() {
            document.getElementById("profilePopup").style.display = "none";
        }

        // ✅ Search Blood Group Function
        function searchBloodGroup() {
            const bloodGroup = document.getElementById("bloodGroupSearch").value.trim().toUpperCase();

            fetch(`http://localhost:3019/search_blood_group?bloodGroup=${bloodGroup}`)
                .then(response => response.json())
                .then(data => {
                    const donorList = document.getElementById("donorList");
                    donorList.innerHTML = ""; // Clear previous results

                    if (data.success) {
                        data.donors.forEach(donor => {
                            const listItem = document.createElement("li");
                            listItem.innerHTML = `
                                <strong>Name:</strong> ${donor.name} <br>
                                <strong>Age:</strong> ${donor.age} <br>
                                <strong>Phone:</strong> ${donor.phno} <br>
                                <strong>Address:</strong> ${donor.address} <br>
                                <hr>
                            `;
                            donorList.appendChild(listItem);
                        });
                    } else {
                        donorList.innerHTML = "<li>No donors found for this blood group.</li>";
                    }
                })
                .catch(error => console.error("Error searching blood group:", error));
            }

// Open Profile Popup
function openProfilePopup() {
    document.getElementById("profilePopup").style.display = "block";
}
// Close Profile Popup
function closeProfilePopup() {
    document.getElementById("profilePopup").style.display = "none";
}
// Search Blood Group Function
function searchBloodGroup() {
    const bloodGroup = document.getElementById("bloodGroupSearch").value.trim().toUpperCase();
    fetch`(http://localhost:3019/search_blood_group?bloodGroup=${bloodGroup})`
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert`(Blood Group Found! \nDonors: ${JSON.stringify(data.donors)})`;
            } else {
                alert("No donors found for this blood group.");
            }
        })
        .catch(error => console.error("Error searching blood group:", error));
}

/// ✅ Redirect to Info Page
function redirectToInfo(topic) {
    window.location.href = `info.html?info=${encodeURIComponent(topic)}`;
}


// Info Page Script
if (window.location.pathname.includes("info.html")) {
    const infoData = {
        "Blood Purity & Care": "Regular blood donation helps eliminate excess iron, reducing the risk of iron overload and promoting overall health.",
        "Benefits of Blood Donation": "Donating blood can improve heart health, reduce harmful iron levels, and even enhance mental well-being by helping others.",
        "Health Tips for Donors": "Stay hydrated, eat a healthy meal before donating, and avoid alcohol or strenuous activities after donation.",
        "Blood Type Compatibility": "O-negative is the universal donor, while AB-positive is the universal recipient. Matching blood types is crucial for safe transfusions.",
        "Iron Levels & Diet": "Consume iron-rich foods like spinach, red meat, and beans to replenish iron lost during blood donation.",
        "Emergency Blood Needs": "Blood shortages can occur during disasters or medical emergencies. Always keep donor contact information ready."
    };

    const params = new URLSearchParams(window.location.search);
    const infoKey = params.get("info");

    if (infoData[infoKey]) {
        document.getElementById("infoTitle").innerText = infoKey;
        document.getElementById("infoText").innerText = infoData[infoKey];
    } else {
        document.getElementById("infoTitle").innerText = "Information Not Found";
        document.getElementById("infoText").innerText = "Please select a valid topic from the dashboard.";
    }
}
