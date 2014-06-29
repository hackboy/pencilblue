/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Deletes a user
 */

function DeleteUser(){}

//inheritance
util.inherits(DeleteUser, pb.BaseController);

DeleteUser.prototype.render = function(cb) {
    var self    = this;
    var vars    = this.pathVars;

    var message = this.hasRequiredParams(vars, ['id']);
    if (message) {
        this.formError(message, '/admin/users/manage_users', cb);
        return;
    }

    //ensure existence
    var dao = new pb.DAO();
    dao.loadById(vars.id, 'user', function(err, user) {
        if(user === null) {
            self.formError(self.ls.get('ERROR_SAVING'), '/admin/users/manage_users', cb);
            return;
        }

        //delete the user
        dao.deleteMatching({_id: ObjectID(vars.id)}, 'user').then(function(result) {
            if(result < 1) {
                self.formError(self.ls.get('ERROR_SAVING'), '/admin/users/manage_users', cb);
                return;
            }

            self.session.success = user.username + ' ' + self.ls.get('DELETED');
            cb(pb.RequestHandler.generateRedirect(pb.config.siteRoot + '/admin/users/manage_users'));
        });
    });
};

//exports
module.exports = DeleteUser;