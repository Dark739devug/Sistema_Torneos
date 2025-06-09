from datetime import datetime, timedelta

def obtener_proxima_fecha(dia_semana):
    dias_semana = {
        "Lunes": 0,
        "Martes": 1,
        "Miércoles": 2,
        "Jueves": 3,
        "Viernes": 4,
        "Sábado": 5,
        "Domingo": 6
    }

    if dia_semana not in dias_semana:
        raise ValueError("Día inválido")

    hoy = datetime.today()
    dia_actual = hoy.weekday()  
    dia_objetivo = dias_semana[dia_semana]


    dias_faltantes = (dia_objetivo - dia_actual + 7) % 7
    if dias_faltantes == 0:
        dias_faltantes = 7  

    proxima_fecha = hoy + timedelta(days=dias_faltantes)
    return proxima_fecha.date()

