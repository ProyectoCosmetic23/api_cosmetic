var DataTypes = require("sequelize").DataTypes;
var _clients = require("./clients");
var _commission_detail = require("./commission_detail");
var _commissions = require("./commissions");
var _defective_products = require("./defective_products");
var _employees = require("./employees");
var _order_detail = require("./order_detail");
var _orders = require("./orders");
var _payments = require("./payments");
var _product_categories = require("./product_categories");
var _products = require("./products");
var _providers = require("./providers");
var _purchase_detail = require("./purchase_detail");
var _purchases = require("./purchases");
var _returns = require("./returns");
var _roles = require("./roles");
var _sale_detail = require("./sale_detail");
var _sales = require("./sales");
var _users = require("./users");

function initModels(sequelize) {
  var clients = _clients(sequelize, DataTypes);
  var commission_detail = _commission_detail(sequelize, DataTypes);
  var commissions = _commissions(sequelize, DataTypes);
  var defective_products = _defective_products(sequelize, DataTypes);
  var employees = _employees(sequelize, DataTypes);
  var order_detail = _order_detail(sequelize, DataTypes);
  var orders = _orders(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var product_categories = _product_categories(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var providers = _providers(sequelize, DataTypes);
  var purchase_detail = _purchase_detail(sequelize, DataTypes);
  var purchases = _purchases(sequelize, DataTypes);
  var returns = _returns(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var sale_detail = _sale_detail(sequelize, DataTypes);
  var sales = _sales(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  payments.belongsTo(clients, { as: "id_client_client", foreignKey: "id_client"});
  clients.hasMany(payments, { as: "payments", foreignKey: "id_client"});
  sales.belongsTo(clients, { as: "id_client_client", foreignKey: "id_client"});
  clients.hasMany(sales, { as: "sales", foreignKey: "id_client"});
  commissions.belongsTo(commission_detail, { as: "id_commission_detail_commission_detail", foreignKey: "id_commission_detail"});
  commission_detail.hasMany(commissions, { as: "commissions", foreignKey: "id_commission_detail"});
  commissions.belongsTo(employees, { as: "id_employee_employee", foreignKey: "id_employee"});
  employees.hasMany(commissions, { as: "commissions", foreignKey: "id_employee"});
  sales.belongsTo(employees, { as: "id_employee_employee", foreignKey: "id_employee"});
  employees.hasMany(sales, { as: "sales", foreignKey: "id_employee"});
  users.belongsTo(employees, { as: "id_employee_employee", foreignKey: "id_employee"});
  employees.hasMany(users, { as: "users", foreignKey: "id_employee"});
  order_detail.belongsTo(orders, { as: "id_order_order", foreignKey: "id_order"});
  orders.hasMany(order_detail, { as: "order_details", foreignKey: "id_order"});
  sales.belongsTo(orders, { as: "id_order_order", foreignKey: "id_order"});
  orders.hasMany(sales, { as: "sales", foreignKey: "id_order"});
  products.belongsTo(product_categories, { as: "id_category_product_category", foreignKey: "id_category"});
  product_categories.hasMany(products, { as: "products", foreignKey: "id_category"});
  defective_products.belongsTo(products, { as: "id_product_product", foreignKey: "id_product"});
  products.hasMany(defective_products, { as: "defective_products", foreignKey: "id_product"});
  order_detail.belongsTo(products, { as: "id_product_product", foreignKey: "id_product"});
  products.hasMany(order_detail, { as: "order_details", foreignKey: "id_product"});
  purchase_detail.belongsTo(products, { as: "id_product_product", foreignKey: "id_product"});
  products.hasMany(purchase_detail, { as: "purchase_details", foreignKey: "id_product"});
  returns.belongsTo(products, { as: "id_product_product", foreignKey: "id_product"});
  products.hasMany(returns, { as: "returns", foreignKey: "id_product"});
  purchases.belongsTo(providers, { as: "id_provider_provider", foreignKey: "id_provider"});
  providers.hasMany(purchases, { as: "purchases", foreignKey: "id_provider"});
  purchase_detail.belongsTo(purchases, { as: "id_purchase_purchase", foreignKey: "id_purchase"});
  purchases.hasMany(purchase_detail, { as: "purchase_details", foreignKey: "id_purchase"});
  users.belongsTo(roles, { as: "id_role_role", foreignKey: "id_role"});
  roles.hasMany(users, { as: "users", foreignKey: "id_role"});
  payments.belongsTo(sales, { as: "id_sale_sale", foreignKey: "id_sale"});
  sales.hasMany(payments, { as: "payments", foreignKey: "id_sale"});
  returns.belongsTo(sales, { as: "id_sale_sale", foreignKey: "id_sale"});
  sales.hasMany(returns, { as: "returns", foreignKey: "id_sale"});

  return {
    clients,
    commission_detail,
    commissions,
    defective_products,
    employees,
    order_detail,
    orders,
    payments,
    product_categories,
    products,
    providers,
    purchase_detail,
    purchases,
    returns,
    roles,
    sale_detail,
    sales,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
