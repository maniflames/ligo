/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/


  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ************** *************************************************************/

  //Root path
  '/': 'UserController.index',

  //Dashboard related Routes
  'GET /dashboard': 'UserController.index',

  'POST /dashboard/results': 'UserController.dashboardSearch',

  'GET /chat': {
    view: 'addChatroom'
  },

  'POST /chat': 'ChatroomController.add',

  //Chatroom and chat related routes

  'GET /chat/:chatroom': 'ChatroomController.show',

  'GET /chat/:chatroom/settings': 'ChatroomController.settings',

  'GET /chat/:chatroom/settings/edit': 'ChatroomController.settingsEdit',

  'POST /chat/:chatroom/leave': 'ChatroomController.leave',

  'POST /chat/:chatroom/settings/addChatMember': 'ChatroomController.addChatMember',

  'POST /chat/:chatroom/settings/removeChatMember': 'ChatroomController.removeChatMember',

  'POST /chat/:chatroom/settings/blockChatMember': 'ChatroomController.blockChatMember',

  //Authentication Routes
  'GET /login': {
    view: 'login'
  },

  'POST /login': 'UserController.login',

  'GET /register': {
    view: 'register'
  },

  'POST /register': 'UserController.register',

  'GET /settings': 'UserController.settings',

  'GET /user/:username': 'UserController.detail',

  'GET /user/:username/edit': 'UserController.detailEdit',

  'POST /user/:username/edit/save': 'UserController.detailEditSave',

  '/logout': 'UserController.logout'

};
