/**
 * Welcome email sent to newly-created students with their login credentials.
 * Extracted from the original inline template in routes/admin.js.
 */
const studentWelcomeEmail = ({ firstName, lastName, email, password, courseTitle }) => `<table
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
          border-collapse: collapse;
          border-spacing: 0px;
          padding: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          background-repeat: repeat;
          background-position: center top;
        "
      >
        <tbody>
          <tr style="border-collapse: collapse">
            <td valign="top" style="padding: 0; margin: 0; padding-top: 70px">
              <table
                cellpadding="0"
                cellspacing="0"
                class="m_-1690223856580286275es-header"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
                "
              >
                <tbody>
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="m_-1690223856580286275es-header-body"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#FFFFFF"
                        align="center"
                        style="
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #ffffff;
                          width: 600px;
                        "
                      >
                        <tbody>
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding: 0; margin: 0">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="border-collapse: collapse; border-spacing: 0px"
                              >
                                <tbody>
                                  <tr style="border-collapse: collapse">
                                    <td
                                      align="center"
                                      valign="top"
                                      style="padding: 0; margin: 0; width: 600px"
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        role="presentation"
                                        style="
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tbody>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="center"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                font-size: 0;
                                              "
                                            >
                                              <table
                                                border="0"
                                                width="100%"
                                                height="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                role="presentation"
                                                style="
                                                  border-collapse: collapse;
                                                  border-spacing: 0px;
                                                "
                                              >
                                                <tbody>
                                                  <tr
                                                    style="border-collapse: collapse"
                                                  >
                                                    <td
                                                      style="
                                                        padding: 0;
                                                        margin: 0;
                                                        border-bottom: 1px solid
                                                          #cccccc;
                                                        background: none;
                                                        height: 1px;
                                                        width: 100%;
                                                        margin: 0px;
                                                      "
                                                    ></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding: 20px; margin: 0;background-color:#e5e5e5;">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="border-collapse: collapse; border-spacing: 0px"
                              >
                                <tbody>
                                  <tr style="border-collapse: collapse">
                                    <td
                                      align="left"
                                      style="padding: 0; margin: 0; width: 560px"
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        role="presentation"
                                        style="
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tbody>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="center"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                font-size: 0px;
                                              "
                                            >
                                              <img
                                                class=" "
                                                src="https://i.ibb.co/6Rwv1Rx/dark-logo.png"
                                                alt="01612179184117"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                "
                                                data-bit="iit"
                                              />
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding: 0; margin: 0">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="border-collapse: collapse; border-spacing: 0px"
                              >
                                <tbody>
                                  <tr style="border-collapse: collapse">
                                    <td
                                      align="center"
                                      valign="top"
                                      style="padding: 0; margin: 0; width: 600px"
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        role="presentation"
                                        style="
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tbody>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="center"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                font-size: 0;
                                              "
                                            >
                                              <table
                                                border="0"
                                                width="100%"
                                                height="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                role="presentation"
                                                style="
                                                  border-collapse: collapse;
                                                  border-spacing: 0px;
                                                "
                                              >
                                                <tbody>
                                                  <tr
                                                    style="border-collapse: collapse"
                                                  >
                                                    <td
                                                      style="
                                                        padding: 0;
                                                        margin: 0;
                                                        border-bottom: 1px solid
                                                          #cccccc;
                                                        background: none;
                                                        height: 1px;
                                                        width: 100%;
                                                        margin: 0px;
                                                      "
                                                    ></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                cellpadding="0"
                cellspacing="0"
                class="m_-1690223856580286275es-content"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                "
              >
                <tbody>
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        style="
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #ffffff;
                          width: 600px;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#FFFFFF"
                        align="center"
                      >
                        <tbody>
                          <tr style="border-collapse: collapse">
                            <td
                              align="left"
                              bgcolor="#FAFAFA"
                              style="
                                margin: 0;
                                padding-left: 20px;
                                padding-right: 20px;
                                padding-top: 40px;
                                padding-bottom: 40px;
                                background-color: #fafafa;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="border-collapse: collapse; border-spacing: 0px"
                              >
                                <tbody>
                                  <tr style="border-collapse: collapse">
                                    <td
                                      align="center"
                                      valign="top"
                                      style="padding: 0; margin: 0; width: 560px"
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        role="presentation"
                                        style="
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tbody>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="left"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-bottom: 20px;
                                              "
                                            >
                                              <h2
                                                style="
                                                  margin: 0;
                                                  line-height: 29px;
                                                  font-family: helvetica,
                                                    'helvetica neue', arial, verdana,
                                                    sans-serif;
                                                  font-size: 24px;
                                                  font-style: normal;
                                                  font-weight: normal;
                                                  color: #252525;
                                                "
                                              >
                                                <strong
                                                  >Welcome to LEARNTOCODE</strong
                                                >
                                              </h2>
                                            </td>
                                          </tr>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="left"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-bottom: 20px;
                                              "
                                            >
                                              <p
                                                style="
                                                  margin: 0;
                                                  font-size: 14px;
                                                  font-family: arial, 'helvetica neue',
                                                    helvetica, sans-serif;
                                                  line-height: 21px;
                                                  color: #333333;
                                                "
                                              >
                                                <b>Dear ${firstName} ${lastName}</b>
                                              </p>
                                            </td>
                                          </tr>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="left"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-bottom: 20px;
                                              "
                                            >
                                              <p
                                                style="
                                                  margin: 0;
                                                  font-size: 14px;
                                                  font-family: arial, 'helvetica neue',
                                                    helvetica, sans-serif;
                                                  line-height: 21px;
                                                  color: #333333;
                                                "
                                              >
                                                you are invited to join LEARNTOCODE as
                                                an student in
                                                <b>${courseTitle}</b>
                                                track.
                                              </p>
                                              <p>
                                                Please use these credentials to login
                                                to your account:
                                              </p>
                                              <ul>
                                                <li>
                                                  <b>Email:</b>
                                                  <a
                                                    href="{mailto:${email}}"
                                                    target="_blank"
                                                    >${email}</a
                                                  >
                                                </li>
                                                <li>
                                                  <b>Password:</b>
                                                  ${password}
                                                </li>
                                              </ul>
                                            </td>
                                          </tr>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="center"
                                              style="padding: 0; margin: 0"
                                            >
                                              <span
                                                class="m_-1690223856580286275es-button-border"
                                                
                                                ><a
                                                  href="https://lerntocode.tn/login"
                                                  class="m_-1690223856580286275es-button"
                                                  style="
                                                    text-decoration: none;
                                                    font-family: -apple-system,
                                                      BlinkMacSystemFont, 'Segoe UI',
                                                      Roboto, Helvetica, Arial,
                                                      sans-serif, 'Apple Color Emoji',
                                                      'Segoe UI Emoji',
                                                      'Segoe UI Symbol';
                                                    font-size: 14px;
                                                    color: #ffffff;
                                                      background:#e50914;
                                                    padding:10px;
                                                    width:150px !important;
                                                    display: inline-block;
                                                     border-radius: 0px;
                                                    font-weight: bold;
                                                    font-style: normal;
                                                    line-height: 17px;
                                                    width: auto;
                                                    text-align: center;
                                                    border-left-width: 20px;
                                                    border-right-width: 20px;
                                                  "
                                                  target="_blank"
                                                  >Sign In</a
                                                ></span
                                              >
                                            </td>
                                          </tr>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="left"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-bottom: 20px;
                                              "
                                            ></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                cellpadding="0"
                cellspacing="0"
                class="m_-1690223856580286275es-footer"
                align="center"
                style="
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                  background-color: transparent;
                  background-repeat: repeat;
                  background-position: center top;
                "
              >
                <tbody>
                  <tr style="border-collapse: collapse">
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="m_-1690223856580286275es-footer-body"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#FFFFFF"
                        align="center"
                        style="
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #ffffff;
                          width: 600px;
                        "
                      >
                        <tbody>
                          <tr style="border-collapse: collapse">
                            <td align="left" style="padding: 0; margin: 0">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="border-collapse: collapse; border-spacing: 0px"
                              >
                                <tbody>
                                  <tr style="border-collapse: collapse">
                                    <td
                                      align="center"
                                      valign="top"
                                      style="padding: 0; margin: 0; width: 600px"
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        role="presentation"
                                        style="
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tbody>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="center"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                font-size: 0;
                                              "
                                            >
                                              <table
                                                border="0"
                                                width="100%"
                                                height="100%"
                                                cellpadding="0"
                                                cellspacing="0"
                                                role="presentation"
                                                style="
                                                  border-collapse: collapse;
                                                  border-spacing: 0px;
                                                "
                                              >
                                                <tbody>
                                                  <tr
                                                    style="border-collapse: collapse"
                                                  >
                                                    <td
                                                      style="
                                                        padding: 0;
                                                        margin: 0;
                                                        border-bottom: 1px solid
                                                          #cccccc;
                                                        background: none;
                                                        height: 1px;
                                                        width: 100%;
                                                        margin: 0px;
                                                      "
                                                    ></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr style="border-collapse: collapse">
                            <td
                              align="left"
                              style="
                                margin: 0;
                                padding-top: 20px;
                                padding-bottom: 20px;
                                padding-left: 20px;
                                padding-right: 20px;
                              "
                            >
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="border-collapse: collapse; border-spacing: 0px"
                              >
                                <tbody>
                                  <tr style="border-collapse: collapse">
                                    <td
                                      align="center"
                                      valign="top"
                                      style="padding: 0; margin: 0; width: 560px"
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        width="100%"
                                        role="presentation"
                                        style="
                                          border-collapse: collapse;
                                          border-spacing: 0px;
                                        "
                                      >
                                        <tbody>
                                          <tr style="border-collapse: collapse">
                                            <td
                                              align="center"
                                              style="padding: 0; margin: 0"
                                            >
                                              <p
                                                style="
                                                  margin: 0;
                                                  font-size: 14px;
                                                  font-family: arial, 'helvetica neue',
                                                    helvetica, sans-serif;
                                                  line-height: 21px;
                                                  color: #545856;
                                                "
                                              >
                                                © LEARNTOCODE. All Rights Reserved.
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>`;

module.exports = studentWelcomeEmail;
