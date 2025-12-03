# Dash App (Dashboard)

This folder contains a standalone Dash (Python) application that renders the dashboard UI.

How to run locally (Windows):

1. Create a virtual environment and activate it:

```powershell
python -m venv .venv
; .\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

3. Start the Dash server:

```powershell
python app.py
```

4. Open the React app and visit `http://localhost:5173/dashboard` (or the React dev port). The dashboard page embeds the Dash app via an iframe pointing to `http://localhost:8050`.

Notes:
- If you deploy to production, consider serving the Dash app behind the same domain (proxy) or building the equivalent using React + Plotly for a single-app deploy.
