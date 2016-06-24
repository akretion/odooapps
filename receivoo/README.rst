.. image:: https://img.shields.io/badge/licence-AGPL--3-blue.svg
   :target: http://www.gnu.org/licenses/agpl-3.0-standalone.html
   :alt: License: AGPL-3

========
Receivoo
========

This modules allows you to manage your receiption of goods through an external system (ie mobile application) by providing an nice and friendly API.

Configuration
=============

If you need to return other data, override `move.get_receivoo_data()` like this : 

.. code:: python
# in custom/move.py

from openerp import models, api

class StockMove(models.Model):
    _inherit = 'stock.move'

    @api.multi
    def get_receivoo_data(self):
        self.ensure_one()
        data = super(StockMove, self).get_receivoo_data()
        data['my_new_key'] = 'my_new_value'
        return data



Usage
=====

To use this module, you need to call the api via xml/RPC or JSON.

1) get a list of incoming moves with get_incoming_move()
2) mark a some moves as done with `do_incoming_transfer()` (optionnaly you can set a supplier_reference (ie supplier's deposit slip id) )

Have a look to akretion's "receptions" JS applications for an example of frontend.

Known issues / Roadmap
======================


Bug Tracker
===========

Bugs are tracked on `GitHub Issues
<https://github.com/akretion/odooapps/issues>`_. In case of trouble, please
check there if your issue has already been reported. If you spotted it first,
help us smashing it by providing a detailed and welcomed feedback.

Credits
=======
* Akretion

Images
------

* Odoo Community Association: `Icon <https://github.com/OCA/maintainer-tools/blob/master/template/module/static/description/icon.svg>`_.

Contributors
------------

* Sébastien BEAU <sebastien.beau@akretion.com>
* Raphaël Reverdy <raphael.reverdy@akretion.com>

Maintainer
----------

`Akretion<https://akretion.com>`

.. image:: https://odoo-community.org/logo.png
   :alt: Odoo Community Association
   :target: https://odoo-community.org

This module is maintained by the OCA.

OCA, or the Odoo Community Association, is a nonprofit organization whose
mission is to support the collaborative development of Odoo features and
promote its widespread use.

To contribute to this module, please visit https://odoo-community.org.
