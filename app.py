from flask import Flask, render_template, jsonify, request
from api_helper import get_game_data
from prediction_engine import get_v5_logic
from config import V5_SALT, TRUSTWIN_SALT

app = Flask(__name__)

# Route for the Home Page
@app.route('/')
def home():
    return render_template('index.html')

# API Endpoint that the website calls to get a prediction
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    platform = data.get('platform', 'Tiranga')
    game_time = data.get('time', '30s') # "30s" or "1m"
    
    # 1. Fetch Data using your existing helper
    period, history = get_game_data(game_time, platform=platform)
    
    if not period:
        return jsonify({"status": "error", "message": "API Error"}), 500

    # 2. Get Logic using your existing engine
    pred, pattern, digit = get_v5_logic(period, game_time, history, platform=platform)
    
    # 3. Format History for Display (Last 6 outcomes)
    trend_ui = []
    if history:
        for h in history[:6]: # Get recent 6
            trend_ui.append("🔴" if h['o'] == "Big" else "🟢")
    
    return jsonify({
        "status": "success",
        "period": period,
        "prediction": pred,       # "Big" or "Small"
        "color": "red" if pred == "Big" else "green",
        "pattern": pattern,
        "trend": trend_ui
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
