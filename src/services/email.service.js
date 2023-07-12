/* eslint-disable no-path-concat */
/* eslint-disable prefer-template */
const nodemailer = require('nodemailer');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const ejs = require('ejs');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (receiver, content, tempData) => {
  // const templatePath = path.join(__dirname, '../utils/templates/verify.email.ejs');
  // const data = ejs.renderFile(templatePath);
  ejs.renderFile(
    path.join(__dirname, '../utils//templates/' + tempData.template_name),
    { receiver, content },
    async (err, data) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      } else {
        const mailOptions = {
          from: config.email.from,
          to: receiver.email,
          subject: tempData.subject,
          html: data,
        };
        // const msg = { from: config.email.from, to, subject, text };
        await transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            // eslint-disable-next-line no-console
            return console.log(error);
          }
          // eslint-disable-next-line no-console
          console.log('Message sent: %s', info.messageId);
          return { response: 'email sent succesfully' };
        });

        // const sendResponse = await transport.sendMail(mailOptions);
        // if (!sendResponse.messageId) {
        //   console.log("---------error");
        //   return { error: sendResponse };
        // }
        // console.log("---------success");
        // return { success: sendResponse.messageId };
      }
    }
  );
};

module.exports = {
  transport,
  sendEmail,
};
