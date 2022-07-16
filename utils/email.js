const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Cartallum <${process.env.EMAIL_FROM}>`;
  }
  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport(
        sgTransport({
          auth: {
            api_key: process.env.SENDGRID_API_KEY,
          },
        })
      );
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html, { wordwrap: 130 }),
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('bem_vindo', 'Bem vindo ao Cartallum!');
  }

  async sendPasswordReset() {
    await this.send(
      'password_reset',
      'Seu token de reset de senha (válido por 10 minutos)'
    );
  }
};
