const UserModel = require("../api/user/userModel");
const InstitutionModel = require("../api/institution/institutionModel");
const { signToken } = require("./authBasic");
const nodemailer = require("nodemailer");

exports.signin = (req, res, next) => {
  //* Check if the username and password are correct, if yes send the token
  const token = signToken(req.user._id, req.user.username, req.user.name, req.user.thumbnail, req.user.role, req.user.institution.name);
  res.json({ token });
};

exports.hasRole = role => (req, res, next) => {
  if (req.user.role === role || role === "" || role === undefined) {
    next();
  } else {
    next(new Error("You can't access this route."));
  }
};

exports.signup = (req, res, next) => {
  //* Create institution then create the user
  //* Error if institution exists
  const { name, institution, email, password, role } = req.body;
  const Institution = new InstitutionModel({ name: institution });
  Institution.save()
    .then(newInstitution => {
      const User = new UserModel({ name, email, password, role, institution: newInstitution._id });
      User.save()
        .then(newUser => {
          const token = signToken(newUser._id, newUser.email, newUser.name, newUser.thumbnail, newUser.role, newUser.institution);
          sendNewUserEmail({ name, email});
          res.json({ token });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
};

const sendNewUserEmail = ({email, name }) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "lynx.edu7@gmail.com",
      pass: process.env.GMAIL_PASS
    }
  });
  transporter
    .sendMail({
      from: '"Lynx Educação" <lynx.edu7@gmail.com>',
      to: email,
      subject: `${name}, seja bem vindo ao Lynx Educação!`,
      text: `${name}, Bem vindo ao Lynx!!!\n\n\nAgora a sua instituição já faz parte do sistema Lynx, entre e comece a utilizar, primeiro cadastre os professores, depois os alunos e ai é só começar a gerenciar e acompanhar os projetos.\n\nConte sempre conosco, estamos sempre abertos a sugestões e críticas!\n\nMuito obrigado,\n\nEquipe Lynx\n\nAcesse http:// lynxeducacao.netlify.com\n\n© Lynx Corporate made with ❤️\n\nEsse é um e-mail automático, favor não responder!`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]--> <!--[if (gte mso 9)|(IE)]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml> <![endif]--> <!--[if (gte mso 9)|(IE)]><style type="text/css">body{width:600px;margin:0 auto}table{border-collapse:collapse}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic}</style><![endif]--><style type="text/css">body,p,div{font-family:arial;font-size:14px}body{color:#000}body a{color:#1188E6;text-decoration:none}p{margin:0;padding:0}table.wrapper{width:100% !important;table-layout:fixed;-webkit-font-smoothing:antialiased;-webkit-text-size-adjust:100%;-moz-text-size-adjust:100%;-ms-text-size-adjust:100%}img.max-width{max-width:100% !important}.column.of-2{width:50%}.column.of-3{width:33.333%}.column.of-4{width:25%}@media screen and (max-width:480px){.preheader .rightColumnContent, .footer .rightColumnContent{text-align:left !important}.preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span{text-align:left !important}.preheader .rightColumnContent, .preheader .leftColumnContent{font-size:80% !important;padding:5px 0}table.wrapper-mobile{width:100% !important;table-layout:fixed}img.max-width{height:auto !important;max-width:480px !important}a.bulletproof-button{display:block !important;width:auto !important;font-size:80%;padding-left:0 !important;padding-right:0 !important}.columns{width:100% !important}.column{display:block !important;width:100% !important;padding-left:0 !important;padding-right:0 !important;margin-left:0 !important;margin-right:0 !important}}</style></head><body><center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ffffff;"><div class="webkit"><table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ffffff"><tr><td valign="top" bgcolor="#ffffff" width="100%"><table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td> <!--[if mso]><center><table><tr><td width="600"> <![endif]--><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center"><tr><td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"><tr><td role="module-content"><p></p></td></tr></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center"> <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:40% !important;width:40%;height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/960a03ee8a38ae69285f0e028983f32e04bed36b0dc8000668e7c302e0770125d8b5f5e711602d29979d0e893520a2666d7933f2ad52476c3934b69f395c96ee.png" alt="" width="240"></td></tr></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:18px 18px 18px 18px;line-height:25px;text-align:justify;" height="100%" valign="top" bgcolor=""><div><span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><span style="font-size:18px;"><strong>${name}</strong>, Bem vindo ao Lynx!!!</span></span></div><div>&nbsp;</div><div><span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><span style="font-size:16px;">Agora a sua institui&ccedil;&atilde;o j&aacute; faz parte do sistema Lynx, entre e comece a utilizar, primeiro cadastre os professores, depois os alunos e ai &eacute; s&oacute; come&ccedil;ar a gerenciar e acompanhar os projetos.</span></span></div><div>&nbsp;</div><div><span style="font-family:lucida sans unicode,lucida grande,sans-serif;"><span style="font-size:16px;">Conte sempre conosco, estamos sempre abertos a sugest&otilde;es e cr&iacute;ticas!&nbsp;</span></span></div><div>&nbsp;</div><div><font face="lucida sans unicode, lucida grande, sans-serif"><span style="font-size: 16px;">Muito obrigado,</span></font></div><div>&nbsp;</div></td></tr></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" bgcolor="" class="outer-td" style="padding:0px 0px 0px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#f79f1c" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit"><a href="https://lynxeducacao.netlify.com" style="background-color:#f79f1c;border:1px solid #333333;border-color:#f79f1c;border-radius:54px;border-width:1px;color:#ffffff;display:inline-block;font-family:helvetica,arial,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:12px 18px 12px 18px;text-align:center;text-decoration:none" target="_blank">Acesse</a></td></tr></tbody></table></td></tr></tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor=""></td></tr></table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor=""><table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="2px" style="line-height:2px; font-size:2px;"><tr><td style="padding: 0px 0px 2px 0px;" bgcolor="#338ceb"></td></tr></table></td></tr></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;"><tr><td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit;" height="100%" valign="top" bgcolor=""><div style="text-align: center;"><span style="color: rgb(84, 84, 84); font-family: arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400;">&copy;&nbsp;</span>Lynx Corporate feito com ❤️</div><div style="text-align: center;"><span style="color:#A9A9A9;">Esse &eacute; um e-mail autom&aacute;tico, favor n&atilde;o responder!</span></div></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table></center> <![endif]--></td></tr></table></td></tr></table></td></tr></table></div></center></body></html>`
    })
    .then(info => console.log(info))
    .catch(error => console.log(error));
};