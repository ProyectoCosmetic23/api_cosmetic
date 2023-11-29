// controllers/dashboardController.js

const {Report, ReportCard} = require('../../models/reportProducts');
const sequelize = require('../../config/sequelize');
const { ReportCountedSales, ReportCreditSales, ReportEmployesSales } = require('../../models/reportSales');

const getReportEmployees = async (req, res, next) => {
    try {
        let { report_is_yearly, year_data, month_data } = req.query;
        const result = await sequelize.query(
            'SELECT * FROM get_report_employees(:report_is_yearly, :year_data, :month_data)',
            {
                replacements: {
                    report_is_yearly,
                    year_data,
                    month_data,
                },
                type: sequelize.QueryTypes.SELECT,
                model: ReportEmployesSales,
            }
        );
        res.json(result);
    } catch (error) {
        console.error('Error al recuperar las categorías:', error);
        next(error);
    }
};

const getReportProducts = async (req, res, next) => {
    try {
        let { report_is_yearly, year_data, month_data } = req.query;
        const result = await sequelize.query(
            'SELECT * FROM get_report_products(:report_is_yearly, :year_data, :month_data)',
            {
                replacements: {
                    report_is_yearly,
                    year_data,
                    month_data,
                },
                type: sequelize.QueryTypes.SELECT,
                model: Report,
            }
        );
        res.json(result);
    } catch (error) {
        console.error('Error al recuperar las categorías:', error);
        next(error);
    }
};

const getReportCards = async (req, res, next) => {
    try {
        let { report_is_yearly, year_data, month_data } = req.query;
        const result = await sequelize.query(
            'SELECT * FROM get_report_cards(:report_is_yearly, :year_data, :month_data)',
            {
                replacements: {
                    report_is_yearly,
                    year_data,
                    month_data,
                },
                type: sequelize.QueryTypes.SELECT,
                model: ReportCard,
            }
        );
        res.json(result);
    } catch (error) {
        console.error('Error al recuperar las categorías:', error);
        next(error);
    }
};

const getReportSales = async (req, res, next) => {
    try {
        let { year_data, month_data } = req.query;
        const resultCredit = await sequelize.query(
            'SELECT * FROM get_report_credit_sales(:year_data)',
            {
                replacements: {
                    year_data
                },
                type: sequelize.QueryTypes.SELECT,
                model: ReportCreditSales,
            });

        const resultCounted = await sequelize.query(
            'SELECT * FROM get_report_counted_sales(:year_data)',
            {
                replacements: {
                    year_data
                },
                type: sequelize.QueryTypes.SELECT,
                model: ReportCountedSales,
            });
        res.json({resultCredit:resultCredit, resultCounted:resultCounted});
    } catch (error) {
        console.error('Error al recuperar las categorías:', error);
        next(error);
    }
};

module.exports = {
    getReportProducts,
    getReportSales,
    getReportCards,
    getReportEmployees
};
