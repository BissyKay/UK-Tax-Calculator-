// UK Tax Calculator - Developed by Bisola 💷

let chartType = "pie"; // Default chart type
let taxChartInstance;

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

// Function to Calculate Tax and Update Graph
function calculateTax() {
    let income = parseFloat(document.getElementById("income").value) || 0;
    let pension = parseFloat(document.getElementById("pension").value) || 0;
    let studentLoan = parseFloat(document.getElementById("studentLoan").value) || 0;
    let otherDeductions = parseFloat(document.getElementById("otherDeductions").value) || 0;

    if (income < 0 || pension < 0 || studentLoan < 0 || otherDeductions < 0) {
        document.getElementById("result").innerHTML = `<b style="color: red;">❌ Please enter valid positive numbers.</b>`;
        return;
    }

    let tax = 0;
    let nationalInsurance = 0;
    let taxFreeAllowance = 12570;
    let taxableIncome = income - pension - taxFreeAllowance;

    if (taxableIncome > 0) {
        if (taxableIncome <= 37700) {
            tax = taxableIncome * 0.2;
        } else if (taxableIncome <= 112570) {
            tax = (37700 * 0.2) + ((taxableIncome - 37700) * 0.4);
        } else {
            tax = (37700 * 0.2) + ((112570 - 37700) * 0.4) + ((taxableIncome - 112570) * 0.45);
        }
    }

    if (income > 12570) {
        if (income <= 50270) {
            nationalInsurance = (income - 12570) * 0.1;
        } else {
            nationalInsurance = (50270 - 12570) * 0.1 + (income - 50270) * 0.02;
        }
    }

    let totalDeductions = tax + nationalInsurance + studentLoan + otherDeductions;
    let netIncome = income - totalDeductions;

    let resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <b>📊 Income Breakdown:</b><br>
        <b>💰 Gross Income:</b> £${income.toFixed(2)}<br>
        <b>🧾 Estimated Tax:</b> £${tax.toFixed(2)}<br>
        <b>💼 National Insurance:</b> £${nationalInsurance.toFixed(2)}<br>
        <b>🎓 Student Loan Repayment:</b> £${studentLoan.toFixed(2)}<br>
        <b>💳 Other Deductions:</b> £${otherDeductions.toFixed(2)}<br>
        <b>🛡️ Tax-Free Allowance:</b> £${taxFreeAllowance.toFixed(2)}<br>
        <b>📉 Pension Deduction:</b> £${pension.toFixed(2)}<br>
        <b>❌ Total Deductions:</b> £${totalDeductions.toFixed(2)}<br>
        <b>✅ Net Income After Tax:</b> £${netIncome.toFixed(2)}
    `;

    updateChart(tax, nationalInsurance, studentLoan, otherDeductions, netIncome);
    saveToLocalStorage(income, pension, studentLoan, otherDeductions);
}

// Function to Toggle Between Pie and Bar Chart
function toggleChart() {
    chartType = chartType === "pie" ? "bar" : "pie";
    calculateTax(); // Refresh chart
}

// Function to Update Chart Visualization
function updateChart(tax, ni, studentLoan, otherDeductions, netIncome) {
    let ctx = document.getElementById("taxChart").getContext("2d");

    if (taxChartInstance) {
        taxChartInstance.destroy(); // Destroy previous chart instance
    }

    taxChartInstance = new Chart(ctx, {
        type: chartType,
        data: {
            labels: ["Income Tax", "National Insurance", "Student Loan", "Other Deductions", "Net Income"],
            datasets: [{
                label: "Tax Breakdown",
                data: [tax, ni, studentLoan, otherDeductions, netIncome],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0"],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                }
            }
        }
    });
}

// Function to Save Data to Local Storage
function saveToLocalStorage(income, pension, studentLoan, otherDeductions) {
    localStorage.setItem("income", income);
    localStorage.setItem("pension", pension);
    localStorage.setItem("studentLoan", studentLoan);
    localStorage.setItem("otherDeductions", otherDeductions);
}

// Function to Download Tax Report as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    doc.text("UK Tax Calculation Report", 10, 10);
    doc.text(document.getElementById("result").innerText, 10, 20);
    doc.save("Tax_Report.pdf");
}
