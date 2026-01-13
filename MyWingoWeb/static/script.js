document.addEventListener('DOMContentLoaded', () => {
    let selectedTime = "30s";

    // Time Selection Logic
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTime = btn.dataset.time;
        });
    });

    // Prediction Button Logic
    document.getElementById('predict-btn').addEventListener('click', async () => {
        const platform = document.getElementById('platform').value;
        const btn = document.getElementById('predict-btn');
        const resultCircle = document.getElementById('result-circle');
        const periodDisplay = document.getElementById('period-display');
        const predText = document.getElementById('prediction-text');
        const trendStrip = document.getElementById('trend-strip');

        // UI Loading State
        btn.innerText = "ANALYZING...";
        btn.disabled = true;
        resultCircle.className = "result-circle"; // Reset color
        predText.innerText = "⏳";

        try {
            // Call Python Backend
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform: platform, time: selectedTime })
            });

            const data = await response.json();

            if (data.status === "success") {
                // Update UI with Result
                periodDisplay.innerText = data.period;
                predText.innerText = data.prediction;
                
                // Set Color
                if (data.prediction === "Big") {
                    resultCircle.classList.add('big');
                } else {
                    resultCircle.classList.add('small');
                }

                document.getElementById('pattern-name').innerText = data.pattern;
                
                // Update Trend Strip
                trendStrip.innerHTML = data.trend.join(" ");
            } else {
                predText.innerText = "ERR";
            }
        } catch (error) {
            console.error(error);
            predText.innerText = "ERR";
        }

        // Reset Button
        btn.innerText = "GET PREDICTION";
        btn.disabled = false;
    });
});