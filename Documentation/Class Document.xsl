<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
    <html>
      <head>
        <style type="text/css">
          body
          {
          font-family: verdana;
          font-size: x-small;
          }
          .Summary
          {
          width: 100%;
          }
          .Summary table
          {
          width: 300px;
          border-collapse: collapse;
          }

          .Summary table th
          {
          vertical-align: top;
          text-align: right;
          background-color: black;
          color: red;
          border: 1px solid white;
          width: 8em;
          }
          .Summary table th, .Summary table td
          {
          padding: 3px;
          border: 1px solid black;
          }

          .ClassLvl a
          {
          text-decoration: underline;
          }
          .ClassLvl.Class a
          {
          color: darkred;
          }
          .ClassLvl.Interface a
          {
          color: blue;
          }
          .ClassLvl.Extension a
          {
          color: green;
          }
          .ClassLvl.Enumerator a
          {
          color: orange;
          }

          .ClassDiv
          {
          float: left; margin-left: 10px;
          }

          .ClassDiv table
          {
          width: 300px;
          }
          .ClassDiv table .Header
          {
          background-color: brown;
          color: white;
          font-weight: bold;
          }
          .ClassDiv table .Header.InterfaceHeader
          {
          background-color: blue;
          }
          .ClassDiv table .Header.EnumHeader
          {
          background-color: orange;
          }

          .ClassDiv table th
          {
          width: 25%;
          text-align: right;
          background-color: #dddddd;
          vertical-align: top;
          }
          .ClassDiv .Property
          {
          font-weight: bold;
          }
          .ClassDiv .Method
          {
          font-weight: bold;
          }
          #ExtensionContent .Header
          {
          background-color: green;
          }
          #ExtensionContent .Method a
          {
          color: green;
          }
          a.Abstract
          {
          color: gray;
          }
          a.Class
          {
          color: darkred;
          }
          a.Enumerator
          {
          color: orange;
          }
        </style>




      </head>
      <title>
        Class Documentation - Package <xsl:value-of select="package/name" />
      </title>
      <body>
        

        <script type="text/javascript">

          function loadClass(name)
          {
          document.getElementById("ClassContent").innerHTML = document.getElementById("Class_"+name).innerHTML;
          }
          function loadInterface(name)
          {
          document.getElementById("InterfaceContent").innerHTML = document.getElementById("Interface_"+name).innerHTML;
          }
          function loadClassAsExtension(name)
          {
          document.getElementById("ExtensionContent").innerHTML = document.getElementById("Class_"+name).innerHTML;
          }
          function loadEnum(name)
          {
          document.getElementById("EnumContent").innerHTML = document.getElementById("Enum_"+name).innerHTML;
          }
          function loadMethod(name)
          {
          var ele = document.getElementById("Method_"+name);
          var cur = ele.style.display;
          if (cur == "none")
            ele.style.display = "";
          else
            ele.style.display = "none";
          }
        </script>

        <div class="Summary">
        <table cellspacing="0" cellpadding="0">
          <tr>
            <th>Package</th>
            <td>
              <xsl:value-of select="package/name" /> (<xsl:value-of select="package/version" />)
            </td>
          </tr>

          <tr>
            <th>Interfaces</th>
            <td>
              <xsl:for-each select="package/interfaces/interface">
                <xsl:sort select="name"/>
                <div class="ClassLvl Interface">
                  <a>
                    <xsl:attribute name="href">
                      javascript:loadInterface('<xsl:value-of select="name" />');
                    </xsl:attribute>
                    <xsl:value-of select="name" />
                  </a>
                </div>
              </xsl:for-each>
            </td>
          </tr>

          <tr>
            <th>Enumerators</th>
            <td>
              <xsl:for-each select="package/enumerators/enumerator">
                <xsl:sort select="name"/>
                <div class="ClassLvl Enumerator">
                  <a>
                    <xsl:attribute name="href">
                      javascript:loadEnum('<xsl:value-of select="name" />');
                    </xsl:attribute>
                    <xsl:value-of select="name" />
                  </a>
                </div>
              </xsl:for-each>
            </td>
          </tr>

          <tr>
            <th>Classes</th>
            <td>
              <xsl:for-each select="package/classes/class">
                <xsl:sort select="name"/>
                <div class="ClassLvl Class">
                  <a>
                    <xsl:attribute name="href">
                      javascript:loadClass('<xsl:value-of select="name" />');
                    </xsl:attribute>
                    <xsl:value-of select="name" />
                  </a>
                </div>
              </xsl:for-each>
            </td>
          </tr>


        </table>
      </div>
      
      <div class="ClassDiv">

        <div id="ClassContent"></div>
        
        <xsl:for-each select="package/classes/class">
          <div style="display:none">
            <xsl:attribute name="id">Class_<xsl:value-of select="name"/></xsl:attribute>
            <table>
              <tr>
                <td colspan="2" class="Header">Class: <xsl:value-of select="name"/></td>
              </tr>
              <tr>
                <th>Desc</th>
                <td>
                  <xsl:value-of select="desc"/>
                </td>
              </tr>
              <tr>
                <th>Extends</th>
                <td>
                  <div class="ClassLvl Extension">
                    <a>
                      <xsl:attribute name="href">
                        javascript:loadClassAsExtension('<xsl:value-of select="extends" />');
                      </xsl:attribute>
                      <xsl:value-of select="extends" />
                    </a>
                  </div>
                  
                </td>
              </tr>
              <tr>
                <th>Implements</th>
                <td>
                  <div class="ClassLvl Interface">
                    <a>
                      <xsl:attribute name="href">
                        javascript:loadInterface('<xsl:value-of select="implements" />');
                      </xsl:attribute>
                      <xsl:value-of select="implements" />
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Properties</th>
                <td>
                  <xsl:apply-templates select="properties" />

                </td>
              </tr>
              <tr>
                <th>Methods</th>
                <td>
                  <xsl:apply-templates select="methods" />

                </td>
              </tr>


            </table>
          </div>
        </xsl:for-each>

      </div>

      <div class="ClassDiv">

        <div id="ExtensionContent"></div>
        
      </div>

      <div class="ClassDiv">

        <div id="InterfaceContent"></div>

        <xsl:for-each select="package/interfaces/interface">
          <div style="display:none">
            <xsl:attribute name="id">Interface_<xsl:value-of select="name"/></xsl:attribute>
            <table>
              <tr>
                <td colspan="2" class="Header InterfaceHeader">
                  Interface: <xsl:value-of select="name"/>
                </td>
              </tr>
              <tr>
                <th>Desc</th>
                <td>
                  <xsl:value-of select="desc"/>
                </td>
              </tr>

              <tr>
                <th>Properties</th>
                <td>
                  <xsl:apply-templates select="properties" />

                </td>
              </tr>
              <tr>
                <th>Methods</th>
                <td>
                  <xsl:apply-templates select="methods" />

                </td>
              </tr>


            </table>
          </div>
        </xsl:for-each>

      </div>

      <div class="ClassDiv">

        <div id="EnumContent"></div>

        <xsl:for-each select="package/enumerators/enumerator">
          <div style="display:none">
            <xsl:attribute name="id">Enum_<xsl:value-of select="name"/></xsl:attribute>
            <table>
              <tr>
                <td colspan="2" class="Header EnumHeader">
                  Enumeration: <xsl:value-of select="name"/>
                </td>
              </tr>
              <tr>
                <th>Desc</th>
                <td>
                  <xsl:value-of select="desc"/>
                </td>
              </tr>

              <tr>
                <th>Types</th>
                <td>
                  <xsl:for-each select="types/type">
                    <div>
                      <xsl:value-of select="name"/>
                    </div>
                  </xsl:for-each>
                </td>
              </tr>
              


            </table>
          </div>
        </xsl:for-each>

      </div>
      
    </body>
  </html>
</xsl:template>

<xsl:template match="methods">

  <xsl:for-each select="method">
    <xsl:sort select="name"/>
    <div>
      <xsl:text> </xsl:text>
      <xsl:apply-templates select="type" />
      <xsl:text> </xsl:text>
      <span class="Method">
        <xsl:value-of select="name"/>
      </span>
      <xsl:text>()</xsl:text>
      
      <xsl:if test="extended">
        <a>
          <xsl:attribute name="href">
            javascript:loadMethod('<xsl:value-of select="parent::*/parent::*/name"/><xsl:text>_</xsl:text><xsl:value-of select="name"/>');
          </xsl:attribute>
          [More]
        </a>
      </xsl:if>
    </div>
    <xsl:apply-templates select="extended" />
    
  </xsl:for-each>
</xsl:template>

  <xsl:template match="extended">
    
    <div style="background-color: #eeeeee;display:none;">

      <xsl:attribute name="id"><xsl:text>Method_</xsl:text><xsl:value-of select="parent::*/parent::*/parent::*/name" /><xsl:text>_</xsl:text><xsl:value-of select="parent::*/name" /></xsl:attribute>
      <table>
        <xsl:if test="desc">
          <tr>
            <th>Desc</th>
            <td>
              <xsl:value-of select="desc"/>
            </td>
          </tr>
        </xsl:if>
        <xsl:if test="arguments">
          <tr>
            <th>Arguments</th>
            <td>
              <xsl:for-each select="arguments/argument">
                <xsl:apply-templates select="type" />
                <xsl:text> </xsl:text>
                <xsl:value-of select="name"/>
                <br />
                <span style="color: gray;">
                  <xsl:value-of select="desc"/>
                </span>
              </xsl:for-each>
            </td>
          </tr>
        </xsl:if>
    </table>
    </div>
  </xsl:template>

<xsl:template match="properties">

  <xsl:for-each select="property">
    <xsl:sort select="name"/>
    <div>
      <xsl:apply-templates select="type" />

      <xsl:text> </xsl:text>
      <span class="Property">
        <xsl:value-of select="name"/>
      </span>
    </div>
  </xsl:for-each>
  
</xsl:template>

  <xsl:template match="type">

    <xsl:choose >
      <xsl:when test=".[@enum='true']">
        <a class="Enumerator">
          <xsl:attribute name="href">
            javascript:loadEnum('<xsl:value-of select="."/>');
          </xsl:attribute>
          <xsl:value-of select="."/>
        </a>
      </xsl:when>
      <xsl:when test=".[@class='true']">
        <a class="Class">
          <xsl:attribute name="href">
            javascript:loadClass('<xsl:value-of select="."/>');
          </xsl:attribute>
          <xsl:value-of select="."/>
        </a>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="."/>
      </xsl:otherwise>
    </xsl:choose>
    
  </xsl:template>
  
</xsl:stylesheet> 

