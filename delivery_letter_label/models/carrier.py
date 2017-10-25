# -*- coding: utf-8 -*-
# Copyright 2017 Akretion (http://www.akretion.com).
# @author Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl).


from openerp.osv import fields, orm


class DeliveryCarrier(orm.Model):
    _inherit = 'delivery.carrier'

    def _get_carrier_type_selection(self):
        """ Add colissimo carrier type """
        res = super(DeliveryCarrier, self)._get_carrier_type_selection()
        res.append(('letter', 'Letter'),)
        return res
