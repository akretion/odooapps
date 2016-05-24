# -*- coding: utf-8 -*-
# © 2016 Akretion (http://www.akretion.com)
# Sébastien BEAU <sebastien.beau@akretion.com>
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

from openerp.osv import fields, orm


class ResPartner(orm.Model):
    _inherit = 'res.partner'

    _columns = {
        'is_picker': fields.boolean('Is Picker')
    }

    def create(self, cr, uid, vals, context=None):
        if context and context.get('default_is_picker'):
            vals['ref'] = self.pool['ir.sequence'].get(
                cr, uid, 'res.partner.picker', context=context)
        return super(ResPartner, self).create(cr, uid, vals, context=context)
