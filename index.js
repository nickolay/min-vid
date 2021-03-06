/*
 * This Source Code is subject to the terms of the Mozilla Public License
 * version 2.0 (the 'License'). You can obtain a copy of the License at
 * http://mozilla.org/MPL/2.0/.
 */

const pageMod = require('sdk/page-mod');

const getYouTubeUrl = require('./lib/get-youtube-url');
const getVimeoUrl = require('./lib/get-vimeo-url');
const launchVideo = require('./lib/launch-video');
const sendMetricsData = require('./lib/send-metrics-data');
const contextMenuHandlers = require('./lib/context-menu-handlers');
const windowUtils = require('./lib/window-utils');

let launchIconsMod;

exports.main = function() {
  // add launch icon to video embeds
  launchIconsMod = pageMod.PageMod({
    include: '*',
    contentStyleFile: './icon-overlay.css?cachebust=' + Date.now(),
    contentScriptFile: './icon-overlay.js?cachebust=' + Date.now(),
    onAttach: function(worker) {
      worker.port.on('launch', function(opts) {
        if (opts.domain.indexOf('youtube.com') > -1) {
          opts.getUrlFn = getYouTubeUrl;
          sendMetricsData({
            object: 'overlay_icon',
            method: 'launch',
            domain: opts.domain
          });
          launchVideo(opts);
        } else if (opts.domain.indexOf('vimeo.com')  > -1) {
          opts.getUrlFn = getVimeoUrl;
          sendMetricsData({
            object: 'overlay_icon',
            method: 'launch',
            domain: opts.domain
          });
          launchVideo(opts);
        }
      });
      worker.port.on('metric', sendMetricsData);
    }
  });

  contextMenuHandlers.init(windowUtils.getWindow());
};
exports.onUnload = function(reason) {
  windowUtils.destroy(true);
  contextMenuHandlers.destroy();
  launchIconsMod.destroy();
};
