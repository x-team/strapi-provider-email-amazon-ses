// based on https://github.com/strapi/strapi/blob/master/packages/strapi-provider-email-amazon-ses/lib/index.js

'use strict';

/**
 * Module dependencies
 */

/* eslint-disable prefer-template */
// Public node modules.
const nodeSES = require('node-ses');

/* eslint-disable no-unused-vars */
module.exports = {
  provider: 'amazon-ses',
  name: 'Amazon SES (X-Team)',
  auth: {
    amazon_ses_default_from: {
      label: 'Default From',
      type: 'text',
    },
    amazon_ses_default_replyto: {
      label: 'Default Reply-To',
      type: 'text',
    },
  },

  init: config => {
    const {
      AWS_SES_KEY,
      AWS_SES_SECRET,
      AWS_SES_ENDPOINT
    } = process.env
  
    const client = nodeSES.createClient({
      key: AWS_SES_KEY,
      secret: AWS_SES_SECRET,
      amazon: AWS_SES_ENDPOINT
    });

    return {
      send: options => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = options || {};
          options.from = config.amazon_ses_default_from || options.from;
          options.replyTo = config.amazon_ses_default_replyto || options.replyTo;
          options.text = options.text || options.html;
          options.html = options.html || options.text;

          const {
            from,
            to,
            replyTo,
            subject,
            text,
            html
          } = options;

          const msg = {
            from,
            to,
            replyTo,
            subject,
            altText: text,
            message: html
          };

          client.sendEmail(msg, (err) => {
            if (err) {
              console.error(err);
              reject([{ messages: [{ id: 'Auth.form.error.email.invalid' }] }]);
            } else {
              resolve();
            }
          });
        });
      },
    };
  },
};
