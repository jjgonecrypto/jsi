<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:template match="/">

    <html xmlns="http://www.w3.org/1999/xhtml" >
      <head>
        <title>jsi:javascript.interface - version history</title>
        <link rel="stylesheet" href="./Styles/Styles.css" />
        <style type="text/css">
          body,html
          {
          font-family: verdana;
          font-size: 0.85em;
          width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          }
          .All
          {
          width: 100%;
          height: 100%;
          }
          .Top
          {
          width: 100%;
          height: 3em;
          color: white;
          background-color: #bc8c46;
          border-bottom: 1px solid gray;
          padding: 0px;
          padding-top: 1em;
          text-align: center;
          }
          .Top .Heading
          {
          font-size: 150%;
          font-family: Tahoma;
          }
          .Rest
          {
          padding: 10px;
          text-align: center;
          }
          .File
          {
          font-weight: bold;
          }
          table.List
          {
          width: 83%;

          margin-top: 10px;
          border-collapse: collapse;
          font-size: 100%;
          }
          table.List .Heading
          {
          background-color: #66CC00;
          color: white;
          }
          table.List td, table.List th
          {
          padding: 3px;
          border: 1px solid black;
          text-align: left;
          }
          table.List th
          {
          text-align:center;
          }

          .Bottom
          {
            position: fixed;
            bottom: 0px;
            width: 100%;
            height: 1em;

            background-color: #bc8c46;
            border-top: 1px solid gray;
          }
          table.List td
          {
          vertical-align: top;
          }
          ol.Ordered
          {
          margin: 0px;
          list-style-type:lower-roman;
          }
          ol.Ordered li
          {
          margin-top: 5px;
          }
          ol.Ordered > li:first-child
          {
          margin-top: 0px;
          }
        </style>
      </head>
      <body>
        <div class="All">
          <div class="Top">
            <div class="Heading">jsi:javascript.interface</div>
          </div>
          <div class="Rest">
            <strong>Version History</strong>
            <table class="List" cellspacing="0" cellpadding="0" align="center">
              <tr class="Heading">
                <th>Version</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
              <xsl:for-each select="history/version">
                <xsl:sort data-type="number" select="major" order="descending"/>
                <xsl:sort data-type="number" select="minor" order="descending"/>
                <xsl:sort data-type="number" select="revision" order="descending"/>
                <tr>
                  <td style="width: 8em;  text-align: center; font-weight: bold;">
                    <xsl:value-of select="major"/>.<xsl:value-of select="minor"/>.<xsl:value-of select="revision"/>
                  </td>
                  <td>
                    <ol class="Ordered">
                      <xsl:for-each select="notes/note">
                        <li>
                          <xsl:value-of select="." />
                        </li>
                      </xsl:for-each>
                    </ol>
                  </td>
                  <td style="width: 8em; text-align: center;">
                    <xsl:value-of select="date" />
                  </td>
                </tr>
              </xsl:for-each>
            </table>

          </div>
          <div class="Bottom"></div>
        </div>
      </body>
    </html>

  </xsl:template>

</xsl:stylesheet>