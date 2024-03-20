const { Op } = require("sequelize");
const Comission_Detail = require("../../models/commission_detail");
const Comissions = require("../../models/commissions");
const Orders = require("../../models/orders");
const Employee = require("../../models/employees");

async function createComs(req, res) {
  const { id_employee, id_commission_detail } = req.body;

  const requiredFields = ["id_employee", "id_commission_detail"];

  // Check if all required fields are provided
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      return res.status(400).json({ error: `Field "${field}" is required.` });
    }
  });

  try {
    // Obtener el detalle de comisión para el mes correspondiente
    const comissionDetail = await Comission_Detail.findByPk(
      id_commission_detail
    );

    if (!comissionDetail) {
      return res
        .status(400)
        .json({ error: "Detalle de comisión no encontrado." });
    }

    const comissionExist = await Comissions.findOne({
      where: {
        id_employee,
        id_commission_detail,
      },
    });

    if (comissionExist) {
      return res.status(400).json({
        error:
          "Ya existe una comisión registrada para este empleado en el mismo mes.",
      });
    }

    const month = comissionDetail.month_commission

    const monthSliced = month.slice(0,7)
    
    // Obtener el primer y último día del mes
    const year = parseInt(monthSliced.slice(0, 4)); // Obtener el año
    const monthIndex = parseInt(monthSliced.slice(5, 7)) - 1; // Obtener el índice del mes (de 0 a 11)

    const firstDayMonth = new Date(year, monthIndex, 1);
    const lastDayMonth = new Date(year, monthIndex + 1, 0);

    // Ajustar las fechas para comparar solo hasta el día (sin hora)
    firstDayMonth.setHours(0, 0, 0, 0);
    lastDayMonth.setHours(23, 59, 59, 999);
    
    // Calcular el total de ventas del empleado durante ese mes
    let employeeSales = await Orders.sum("total_order", {
      where: {
        id_employee,
        order_date: {
          [Op.gte]: firstDayMonth,
          [Op.lte]: lastDayMonth,
        },
      },
    });

    if (employeeSales === null) {
      employeeSales = 0; // Si no hay ventas, establece el total en 0
    }

    // Calcular la comisión multiplicando las ventas por el porcentaje
    const total_commission =
      (employeeSales * comissionDetail.commission_percentage) / 100;

    // Crea una comisión con los datos calculados
    const newComs = await Comissions.create({
      id_employee,
      total_commission,
      id_commission_detail,
      total_sales: employeeSales, // Asignar el valor de total_sales
    });
    console.log(newComs)
    res.status(201).json(newComs);
  } catch (error) {
    res.status(400).json({ error: "Error al crear la comisión." });
    console.log(error.message);
  }
}

// Obtener todos las comisiones
async function getAllComs(req, res) {
  try {
    const comissions = await Comissions.findAll();
    if (comissions.length === 0) {
      return res.status(404).json({ message: "No hay comisiones registradas" });
    }

    // Itera a través de las comisiones y agrega el nombre del empleado
    for (const comission of comissions) {
      const employee = await Employee.findByPk(comission.id_employee);
      comission.employee_name = employee ? employee.name_employee : "";
    }

    res.json(comissions);
  } catch (error) {
    console.error("Error fetching comissions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Obtener todos los empleados filtrados por fecha
async function getAllEmployeesFiltered(req, res) {
  const { dateToString } = req.params;

  try {
    const employees = await Employee.findAll();
    if (employees.length === 0) {
      return res.status(404).json({ message: "No hay empleados registrados" });
    }

    // Parsear el mes seleccionado en año y mes separados
    const [selectedYear, selectedMonth] = dateToString.split("-");

    // Convertir el mes y el año seleccionados en fechas de inicio y fin del mes
    const startDate = new Date(selectedYear, selectedMonth - 1, 1); // El mes en JavaScript es de 0 a 11, por eso restamos 1
    const endDate = new Date(selectedYear, selectedMonth, 0); // Día 0 del siguiente mes es el último día del mes actual

    const orders = await Orders.findAll({
      where: {
        order_date: {
          [Op.between]: [startDate, endDate], // Buscar todos los pedidos entre startDate y endDate
        },
        order_state: "Activo",
      },
    });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay órdenes registradas para este mes" });
    }

    // Filtrar empleados que tienen pedidos asociados
    const employeesWithOrders = employees.filter((employee) =>
      orders.some((order) => order.id_employee === employee.id_employee)
    );

    if (employeesWithOrders.length === 0) {
      return res.status(404).json({
        message: "No hay empleados con pedidos registrados para este mes",
      });
    }

    // Hacer lo que necesites con los empleados y los pedidos encontrados
    return res.status(200).json(employeesWithOrders);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

//Obtener comision por id de empleado
async function getComsEmploy(req, res) {
  const id_employee = req.params.id;

  try {
    const comsEmployee = await Comissions.findAll({
      where: { id_employee },
    });

    if (comsEmployee.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay comisiones para este empleado" });
    }
    res.json(comsEmployee);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
async function getComsDetailId(req, res) {
  const id_commission_detail = req.params.id;

  try {
    const comsDetailComs = await Comissions.findAll({
      where: { id_commission_detail },
    });

    if (comsDetailComs.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay comisiones para este detalle" });
    }
    res.json(comsDetailComs);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
// Obtener una comision por ID
async function getComsById(req, res) {
  const { id } = req.params;
  try {
    const comissions = await Comissions.findByPk(id);
    if (!comissions) {
      return res.status(404).json({ error: "Comisión no encontrada." });
    }
    res.json({ comissions });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la comisión." });
  }
}

async function getSalesByEmployeeAndMonth(req, res) {
  const { id_employee, month } = req.params;
  const monthSliced = month.slice(0, 7);

  try {
    // Obtener el primer y último día del mes
    const year = parseInt(monthSliced.slice(0, 4)); // Obtener el año
    const monthIndex = parseInt(monthSliced.slice(5, 7)) - 1; // Obtener el índice del mes (de 0 a 11)

    const firstDayMonth = new Date(year, monthIndex, 1);
    const lastDayMonth = new Date(year, monthIndex + 1, 0);

    // Ajustar las fechas para comparar solo hasta el día (sin hora)
    firstDayMonth.setHours(0, 0, 0, 0);
    lastDayMonth.setHours(23, 59, 59, 999);

    // Obtener las ventas del empleado para el mes dado
    const employeeSales = await Orders.findAll({
      attributes: ["total_order"],
      where: {
        id_employee,
        order_date: {
          [Op.gte]: firstDayMonth,
          [Op.lte]: lastDayMonth,
        },
      },
    });

    res.json(employeeSales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const updateComissionsFromSales = async (month) => {
  try {
    const adjustedMonth = `${new Date(month).getFullYear()}-${(
      "0" +
      (new Date(month).getMonth() + 1)
    ).slice(-2)}-01`;
    const comissions = await Comissions.findAll({
      include: [
        {
          model: Comission_Detail,
          attributes: ["month_commission", "commission_percentage"],
          where: {
            month_commission: adjustedMonth,
          },
        },
      ],
    });

    for (const comission of comissions) {
      const { id_employee, commission_detail } = comission;

      // Obtener ventas para este empleado y mes
      const employeeSales = await Orders.sum("total_order", {
        where: {
          id_employee,
          order_date: {
            [Op.gte]: new Date(commission_detail.month_commission),
          },
          order_state: {
            [Op.ne]: "Anulado", // Filtrar órdenes que no estén anuladas
          },
        },
      });

      // Actualizar la comisión con las nuevas ventas
      await comission.update({
        total_sales: employeeSales || 0,
        total_commission:
          (employeeSales * commission_detail.commission_percentage) / 100,
      });
    }
    // await t.commit();
  } catch (error) {
    console.error("Error al actualizar comisiones:", error);
  }
};

module.exports = {
  getAllComs,
  getComsById,
  createComs,
  getComsEmploy,
  getComsDetailId,
  getSalesByEmployeeAndMonth,
  updateComissionsFromSales,
  getAllEmployeesFiltered,
};
