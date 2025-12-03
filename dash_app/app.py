from dash import Dash, html, dcc, dash_table, callback_context
from dash.dependencies import Input, Output, State, ALL
import plotly.express as px
import pandas as pd
from datetime import datetime, timedelta
from random import choice, randint
import uuid, json

app = Dash(__name__)


# ------------------------------- helpers ---------------------------------
def minutes_ago_text(dt):
    diff = datetime.now() - dt
    mins = int(diff.total_seconds() // 60)
    if mins <= 0:
        return "agora"
    if mins == 1:
        return "1 min atrás"
    return f"{mins} min atrás"


# ------------------------------- data ------------------------------------
hoje = datetime.now()
inicio_semana = hoje - timedelta(days=hoje.weekday())

dias_semana_full = [
    "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"
]

pacientes = [
    "Ana Silva", "Bruno Costa", "Carla Dantas", "Daniel Alves",
    "Elena Freire", "Fábio Gomes", "Gisela Nunes",
    "Helena Izidro", "Ivan Reis"
]

tipos = ["Individual", "Retorno", "Avaliação", "Emergencial"]

detalhes_consultas = []
for i, dia_nome in enumerate(dias_semana_full):
    num_consultas = [randint(4, 7), randint(5, 8), randint(6, 10),
                    randint(3, 7), randint(5, 9), randint(0, 3), 0][i]
    data_consulta = inicio_semana + timedelta(days=i)
    for _ in range(num_consultas):
        hora = f"{randint(8, 17):02d}:{choice([0, 15, 30, 45]):02d}"
        paciente_nome = choice(pacientes)
        detalhes_consultas.append({
            "Dia": dia_nome,
            "Data": data_consulta.strftime("%d/%m"),
            "Horário": hora,
            "Paciente": paciente_nome,
            "Tipo": choice(tipos)
        })

df_detalhado = pd.DataFrame(detalhes_consultas)
day_order = {day: i for i, day in enumerate(dias_semana_full)}
df_detalhado["Order"] = df_detalhado["Dia"].map(day_order)
df_detalhado.sort_values(["Order", "Horário"], inplace=True)
df_detalhado.drop(columns=["Order"], inplace=True)

# Contagem por tipo
df_tipos_contagem = df_detalhado.groupby("Tipo").size().reset_index(name="Quantidade")
df_tipos_contagem.rename(columns={"Tipo": "Tipo de Consulta"}, inplace=True)

# Contagem mensal (simulada)
df_mensal = pd.DataFrame({
    "Mês": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
    "Pacientes": [22, 30, 45, 50, 47, 60, 75]
})

# KPIs
total_semana = len(df_detalhado)
mais_frequente = df_tipos_contagem.sort_values("Quantidade", ascending=False).iloc[0]["Tipo de Consulta"]
pacientes_unicos = df_detalhado["Paciente"].nunique()
total_atendimentos = len(df_detalhado)


# ------------------------------- gráficos --------------------------------
fig_barras = px.bar(
    df_tipos_contagem,
    x="Tipo de Consulta",
    y="Quantidade",
    title="Contagem por Tipo de Atendimento",
    text_auto=True,
    color_discrete_sequence=px.colors.qualitative.Pastel
)
fig_barras.update_layout(title_x=0.5, margin=dict(l=10, r=10, t=40, b=20), uniformtext_minsize=8)

fig_mensal = px.area(
    df_mensal,
    x="Mês",
    y="Pacientes",
    title="Pacientes Atendidos por Mês",
    markers=True,
    line_shape="spline"
)
fig_mensal.update_layout(title_x=0.5, margin=dict(l=10, r=10, t=40, b=20))


# ------------------------------- estilos ---------------------------------
CARD = {
    "backgroundColor": "white",
    "borderRadius": "12px",
    "padding": "16px",
    "boxShadow": "0 6px 12px rgba(0,0,0,0.08)"
}

KPI_CARD = {
    "backgroundColor": "white",
    "borderRadius": "12px",
    "padding": "12px",
    "boxShadow": "0 6px 12px rgba(0,0,0,0.08)",
    "textAlign": "center",
    "flex": "1",
    "display": "flex",
    "flexDirection": "column",
    "justifyContent": "center",
    "alignItems": "center"
}


# ----------------------- notificações iniciais --------------------------
def make_notification(text, status="sent", source="WhatsApp", minutes_ago=2, details=""):
    created = datetime.now() - timedelta(minutes=minutes_ago)
    return {
        "id": str(uuid.uuid4()),
        "title": text,
        "status": status,  # 'sent' | 'pending' | 'failed'
        "source": source,
        "created": created.isoformat(),
        "details": details
    }

initial_notifs = [
    make_notification("Lembrete de Consulta para João S.", status="sent", minutes_ago=2, details="Enviado via WhatsApp"),
    make_notification("Confirmação de Agendamento para Maria O.", status="sent", minutes_ago=15, details="Enviado via WhatsApp"),
    make_notification("Falha ao Enviar Lembrete para Carlos P.", status="failed", minutes_ago=31, details="Número Inválido")
]


# ------------------------------- layout ----------------------------------
app.layout = html.Div(
    style={"padding": "20px", "backgroundColor": "#f4f7fa", "height": "100vh", "overflowY": "auto", "boxSizing": "border-box"},
    children=[

        # KPIs
        html.Div(style={"display": "flex", "gap": "16px", "marginBottom": "20px"}, children=[
            html.Div(style=KPI_CARD, children=[
                html.Div("Atendimentos na Semana", style={"fontSize": "20px", "fontWeight": "700", "margin": "0"}),
                html.Div(total_semana, style={"fontSize": "16px", "fontWeight": "600", "marginTop": "6px", "color": "#333"})
            ]),
            html.Div(style=KPI_CARD, children=[
                html.Div("Consulta Mais Realizada", style={"fontSize": "20px", "fontWeight": "700", "margin": "0"}),
                html.Div(mais_frequente, style={"fontSize": "16px", "fontWeight": "600", "marginTop": "6px", "color": "#333"})
            ]),
            html.Div(style=KPI_CARD, children=[
                html.Div("Pacientes Diferentes", style={"fontSize": "20px", "fontWeight": "700", "margin": "0"}),
                html.Div(pacientes_unicos, style={"fontSize": "16px", "fontWeight": "600", "marginTop": "6px", "color": "#333"})
            ]),
            html.Div(style=KPI_CARD, children=[
                html.Div("Total Atendimentos", style={"fontSize": "20px", "fontWeight": "700", "margin": "0"}),
                html.Div(total_atendimentos, style={"fontSize": "16px", "fontWeight": "600", "marginTop": "6px", "color": "#333"})
            ]),
        ]),

        # Store + Interval para notificações
        dcc.Store(id="store-notifs", data=initial_notifs),
        dcc.Interval(id="interval-notifs", interval=15_000, n_intervals=0),

        # Agenda + Painel de notificações
        html.Div(style={"display": "flex", "gap": "20px", "marginBottom": "20px"}, children=[
            html.Div(style={**CARD, "flex": "3", "minWidth": "360px"}, children=[
                html.H3("Agenda Semanal Detalhada"),
                dash_table.DataTable(
                    id="tabela-detalhada",
                    columns=[{"name": c, "id": c} for c in ["Data", "Dia", "Horário", "Paciente", "Tipo"]],
                    data=df_detalhado.to_dict("records"),
                    style_table={"height": "480px", "overflowY": "auto"},
                    style_header={"fontWeight": "bold", "backgroundColor": "#e0f7fa", "color": "#00796b"},
                    style_cell={"padding": "10px", "fontSize": "13px"},
                )
            ]),

            html.Div(style={**CARD, "flex": "1", "minWidth": "260px"}, children=[
                html.H3("Atividade Recente"),
                dcc.Tabs(id="tabs-notifs", value="sent", children=[
                    dcc.Tab(label="Notificações Enviadas", value="sent"),
                    dcc.Tab(label="Prontuários Realizados", value="records")
                ]),

                html.Div(id="notifs-container", style={"marginTop": "12px"}),
            ])
        ]),

        # Gráficos
        html.Div(style={"display": "flex", "gap": "20px"}, children=[
            html.Div(style={**CARD, "flex": "1"}, children=[html.H4("Pacientes Atendidos por Mês"), dcc.Graph(figure=fig_mensal, style={"height": "360px"})]),
            html.Div(style={**CARD, "flex": "1"}, children=[html.H4("Contagem por Tipo de Atendimento"), dcc.Graph(figure=fig_barras, style={"height": "360px"})])
        ])
    ]
)


# ------------------------------- callbacks --------------------------------
@app.callback(
    Output("store-notifs", "data"),
    Input("interval-notifs", "n_intervals"),
    State("store-notifs", "data")
)
def simulate_new_notif(n, current):
    if n is None:
        return current
    if randint(1, 4) == 1:
        text = choice([f"Lembrete de Consulta para {choice(pacientes)}.",
                       f"Confirmação de Agendamento para {choice(pacientes)}.",
                       f"Falha ao Enviar Lembrete para {choice(pacientes)}."])
        status = "failed" if "Falha" in text else "sent"
        new = make_notification(text, status=status, minutes_ago=0, details="Automático")
        return [new] + (current or [])
    return current


@app.callback(
    Output("notifs-container", "children"),
    Input("store-notifs", "data"),
    Input("tabs-notifs", "value")
)
def render_notifs(data, tab):
    notifs = data or []
    items = []
    if tab == "records":
        items = [
            html.Div("Prontuário atualizado: João S. - 10:20", style={"padding": "8px 0"}),
            html.Div("Prontuário atualizado: Maria O. - 09:45", style={"padding": "8px 0"})
        ]
    else:
        for n in notifs[:10]:
            status = n.get("status", "sent")
            created = datetime.fromisoformat(n["created"]) if isinstance(n["created"], str) else n["created"]
            time_text = minutes_ago_text(created)
            color = "#90caf9" if status == "sent" else ("#ffe082" if status == "pending" else "#ff8a80")
            right_actions = []
            if status == "failed":
                right_actions.append(html.Button("Reenviar", id={"type": "resend", "index": n["id"]}, n_clicks=0, style={"marginLeft": "8px"}))
            items.append(
                html.Div(style={"display": "flex", "alignItems": "center", "padding": "10px 0", "borderBottom": "1px solid #eee"}, children=[
                    html.Div(style={"width": "44px", "height": "44px", "borderRadius": "22px", "backgroundColor": color, "display": "flex", "alignItems": "center", "justifyContent": "center", "marginRight": "12px"}, children=[
                        html.Div(style={"width": "18px", "height": "18px", "borderRadius": "9px", "backgroundColor": "white"})
                    ]),
                    html.Div(style={"flex": "1"}, children=[
                        html.Div(n["title"], style={"fontWeight": "600"}),
                        html.Div(f"{n.get('details','')} • {time_text}", style={"color": "#777", "fontSize": "12px", "marginTop": "4px"})
                    ]),
                    html.Div(children=right_actions)
                ])
            )
    return html.Div(children=items)


@app.callback(
    Output("store-notifs", "data"),
    Input({"type": "resend", "index": ALL}, "n_clicks"),
    State("store-notifs", "data")
)
def handle_resend(all_clicks, current):
    ctx = callback_context
    if not ctx.triggered:
        return current
    prop_id = ctx.triggered[0]["prop_id"].split(".")[0]
    try:
        id_obj = json.loads(prop_id)
        target_id = id_obj.get("index")
    except Exception:
        return current
    for n in current:
        if n["id"] == target_id:
            n["status"] = "sent" if randint(1, 3) > 1 else "failed"
            n["created"] = datetime.now().isoformat()
            n["details"] = "Reenviado via WhatsApp" if n["status"] == "sent" else "Tentativa falhou"
            break
    return current


if __name__ == "__main__":
    app.run_server(debug=True, host='0.0.0.0', port=8050)
