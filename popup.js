document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculateButton');
    const resultDiv = document.getElementById('result');

    calculateButton.addEventListener('click', calculateRange);
    
    // Clear the initial placeholder when any input is focused
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('focus', () => {
            resultDiv.innerHTML = '<span class="result-label">The missing value will appear here.</span>';
            resultDiv.style.borderColor = '#007bff';
            resultDiv.style.backgroundColor = '#eaf6ff';
            resultDiv.style.color = '#333';
        });
    });

    function calculateRange() {
        // ... (The rest of the calculation logic is identical to the previous version) ...
        
        // 1. Get and clean all input values
        const inputs = {
            batterySize: parseFloat(document.getElementById('batterySize').value.trim()),
            energyUsage: parseFloat(document.getElementById('energyUsage').value.trim()),
            batteryPercentage: parseFloat(document.getElementById('batteryPercentage').value.trim()),
            distanceRemaining: parseFloat(document.getElementById('distanceRemaining').value.trim())
        };

        // Check how many fields are filled
        const filledFields = Object.values(inputs).filter(val => !isNaN(val)).length;
        const missingField = Object.keys(inputs).find(key => isNaN(inputs[key]));

        // 2. Validate Input
        if (filledFields !== 3) {
            resultDiv.innerHTML = '❌ **Error:** Please fill in **exactly 3** out of the 4 fields.';
            resultDiv.style.color = 'red';
            resultDiv.style.borderColor = 'red';
            resultDiv.style.backgroundColor = '#ffe9e9';
            return;
        }

        if (inputs.batteryPercentage > 100 || inputs.batteryPercentage < 0) {
            resultDiv.innerHTML = '❌ **Error:** Battery Percentage must be between 0 and 100.';
            resultDiv.style.color = 'red';
            resultDiv.style.borderColor = 'red';
            resultDiv.style.backgroundColor = '#ffe9e9';
            return;
        }

        // Standardize the percentage value (e.g., 80% becomes 0.80)
        const P_decimal = inputs.batteryPercentage / 100;

        let calculatedValue;
        let unit;
        let label;

        // 3. Perform Calculation (Solving for the missing variable)
        try {
            switch (missingField) {
                case 'distanceRemaining':
                    calculatedValue = (inputs.batterySize * P_decimal * 100) / inputs.energyUsage;
                    label = "Estimated Distance Remaining";
                    unit = "km";
                    break;
                // ... (The rest of the cases for batterySize, energyUsage, batteryPercentage are the same) ...
                case 'batterySize':
                    calculatedValue = (inputs.distanceRemaining * inputs.energyUsage) / (P_decimal * 100);
                    label = "Required Battery Size";
                    unit = "kWh";
                    break;

                case 'energyUsage':
                    calculatedValue = (inputs.batterySize * P_decimal * 100) / inputs.distanceRemaining;
                    label = "Average Energy Usage";
                    unit = "kWh/100km";
                    break;

                case 'batteryPercentage':
                    calculatedValue = ((inputs.distanceRemaining * inputs.energyUsage) / (inputs.batterySize * 100)) * 100;
                    label = "Percentage of Battery Remaining";
                    unit = "%";
                    
                    if (calculatedValue > 100) {
                         resultDiv.innerHTML = `<span class="result-label">Result:</span><br>
                                                 **${label}:** ${calculatedValue.toFixed(2)}${unit}<br>
                                                 <span style="color:red; font-size: 0.9em; font-weight: normal;">⚠️ Warning: This calculated percentage exceeds 100%. Check your inputs.</span>`;
                         resultDiv.style.color = "#333";
                         resultDiv.style.borderColor = 'orange';
                         resultDiv.style.backgroundColor = '#fff6e0';
                         document.getElementById(missingField).value = calculatedValue.toFixed(2);
                         return;
                    }
                    break;

                default:
                    resultDiv.innerHTML = '❌ An unknown error occurred.';
                    resultDiv.style.color = 'red';
                    return;
            }

            // 4. Display Result
            if (isNaN(calculatedValue) || !isFinite(calculatedValue) || calculatedValue <= 0) {
                 resultDiv.innerHTML = "❌ Calculation error. Please ensure all inputs are positive and non-zero.";
                 resultDiv.style.color = "red";
                 resultDiv.style.borderColor = 'red';
                 resultDiv.style.backgroundColor = '#ffe9e9';
            } else {
                 // Success Output
                 resultDiv.innerHTML = `<span class="result-label">${label}:</span><br>**${calculatedValue.toFixed(2)}${unit}**`;
                 resultDiv.style.color = "#155724"; /* Dark Green Text */
                 resultDiv.style.borderColor = '#28a745'; /* Green Border */
                 resultDiv.style.backgroundColor = '#d4edda'; /* Light Green Background */
                 document.getElementById(missingField).value = calculatedValue.toFixed(2);
            }

        } catch (error) {
            resultDiv.innerHTML = '❌ An error occurred during calculation. Check your inputs.';
            resultDiv.style.color = 'red';
            resultDiv.style.borderColor = 'red';
            resultDiv.style.backgroundColor = '#ffe9e9';
        }
    }
});