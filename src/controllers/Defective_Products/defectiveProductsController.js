// pedidosController.js
const Defective_Products = require('../../models/defective_products');


// Obtener todos los pedidos
const getAllDefectiveProducts = async (req, res) => {
    try {
      const defective_products = await Defective_Products.findAll();
      if (defective_products.length === 0) {
        return res.status(404).json({ message: "No hay pedidos registrados" })
      }
      res.json(defective_products);
    } catch (error) {
      console.error('Error al obtener productos: defectuosos', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Exportar las funciones del módulo
module.exports = {
    getAllDefectiveProducts,
  };
  
  
  