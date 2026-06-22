async function loadData() {
    const populationQuery = await fetch("population_query.json").then(res => res.json());

    const employmentQuery = await fetch("employment_query.json").then(res => res.json());

    const populationResponse = await fetch("https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/11ra.px", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(populationQuery)
    });
    
    const populationData = await populationResponse.json();
    console.log(populationData);

    const employmentResponse = await fetch("https://pxdata.stat.fi/PxWeb/api/v1/fi/StatFin/tyokay/115b.px", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(employmentQuery)
    });

    const employmentData = await employmentResponse.json();
    console.log(employmentData);

    const municipalities =
    Object.values(populationData.dimension.alue_23_20260101.category.label);

    const populationValues = populationData.value;

    const employmentValues = employmentData.value;

    const tbody = document.querySelector("tbody");

    municipalities.forEach((municipality, index) => {

        const population = populationValues[index];
        const employment = employmentValues[index];

        const percentage = (employment / population * 100).toFixed(2);

        const row = document.createElement("tr");

        if (percentage >= 45) {
            row.style.backgroundColor = "#abffbd";
        } else if (percentage < 25) {
            row.style.backgroundColor = "#ff9e9e";
        }
        
        row.innerHTML = `
            <td>${municipality}</td>
            <td>${population}</td>
            <td>${employment}</td>
            <td>${percentage}%</td>
        `;

        tbody.appendChild(row);
    });

}

loadData();