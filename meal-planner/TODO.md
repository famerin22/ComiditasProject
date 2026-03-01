# Proyectos Futuros - MealPlan Pro

## 1. Sincronización en la Nube (Base de Datos Real)
- [ ] Configurar **Supabase** (o similar) como backend.
- [ ] Migrar la lógica de `localStorage` a la base de datos.
- [ ] Asegurar que los cambios se reflejen en tiempo real entre el navegador de Fer, el de Meli y los dispositivos móviles.

## 2. Escalado Inteligente de Porciones
- [x] Implementar lógica diferencial en el botón de "Copiar":
    - **Fer -> Meli**: Multiplicar todas las cantidades por **0.65**.
    - **Meli -> Fer**: Multiplicar todas las cantidades por **1.54** (aproximadamente 1/0.65).
- [x] Mantener las unidades coherentes tras el escalado.

## 3. Optimización del Formulario de Cantidad
- [x] Cambiar el valor por defecto del input de cantidad de `1` a vacío.
- [x] Asegurar que el cursor se posicione automáticamente en el campo de cantidad al abrir el modal.

## 4. Expansión de la Base de Datos (Argentina Context)
- [x] Poblar la base de datos con 100-200 alimentos comunes en Argentina (cortes de carne, marcas locales, verduras de estación, etc.).
- [x] Asignar factores de conversión y categorías correctas a cada uno.

## 5. Recetas Anidadas (Componentes)
- [x] Modificar el editor de recetas para permitir que una "Receta" sea seleccionada como ingrediente de otra.
- [x] Ejemplo: Plato "Pasta Boloñesa" = Receta "Salsa Boloñesa" + Receta "Fideos Cocidos".
- [x] Asegurar que la lista de compras desglose todos los niveles de ingredientes.
