document.addEventListener("DOMContentLoaded", async () => {
    const API_URL = "/api/dashboard-data";

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to load dashboard data");
        }
        const data = await response.json();

        // Populate the vaccination list
        populateVaccineList(data.vaccination_camps);

        // Populate the outbreak chart
        createOutbreakChart(data.outbreak_alerts);

    } catch (error) {
        console.error(error);
        const vaccineList = document.getElementById("vaccineList");
        vaccineList.innerHTML = "<li>Error loading data.</li>";
    }
});

function populateVaccineList(camps) {
    const vaccineList = document.getElementById("vaccineList");
    if (!camps || camps.length === 0) {
        vaccineList.innerHTML = "<li>No upcoming camps found.</li>";
        return;
    }

    vaccineList.innerHTML = camps.map(camp => `
        <li>
            <strong>${camp.name}</strong>
            <span>${camp.area} - ${camp.date}</span>
        </li>
    `).join("");
}

function createOutbreakChart(alerts) {
    const ctx = document.getElementById('outbreakChart').getContext('2d');

    const labels = alerts.map(alert => alert.district);
    const data = alerts.map(alert => alert.cases);
    const diseases = alerts.map(alert => alert.disease);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Cases (Sample Data)',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        // Show disease name on hover
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += `${context.parsed.y} cases (${diseases[context.dataIndex]})`;
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}