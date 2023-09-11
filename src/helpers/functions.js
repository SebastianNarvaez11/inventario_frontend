

// funcion para generar diccionario que necesita el input select de marca, categoria y unidad de medida
export const formatDataSelectExtras = (data) => {
    const list = []
    data.map(function (date) {
        const item = { value: date.id, label: date.nombre }
        return list.push(item)
    })
    return list
}

// funcion para formatear un numero a dinero
export const formatNumber = (number) => {
    return new Intl.NumberFormat('de-DE').format(number)
}

