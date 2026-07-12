from odoo import models, fields  # type: ignore[import]


class TransitMaintenance(models.Model):
    _name = "transit.maintenance"
    _description = "Vehicle Maintenance"

    name = fields.Char(
        string="Maintenance Name",
        required=True
    )

    vehicle_id = fields.Many2one(
        "fleet.vehicle",
        string="Vehicle",
        required=True
    )

    maintenance_type = fields.Selection(
        [
            ("service", "Service"),
            ("repair", "Repair"),
            ("inspection", "Inspection")
        ],
        string="Maintenance Type",
        required=True
    )

    maintenance_date = fields.Date(
        string="Maintenance Date",
        default=fields.Date.today
    )

    cost = fields.Float(
        string="Maintenance Cost"
    )

    description = fields.Text(
        string="Description"
    )

    status = fields.Selection(
        [
            ("active", "Active"),
            ("completed", "Completed")
        ],
        string="Status",
        default="active"
    )
