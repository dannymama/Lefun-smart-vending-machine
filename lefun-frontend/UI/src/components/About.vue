<template>
  <md-field style="font-size:0.25rem;line-height:.45rem;color:#858B9C;">
    <h3>
      <p>
        <img style="max-width:100%;" src="/png08-01.png" />
        <br />
      </p>
      <p>Mand Mobile</p>
      <p>
        Mand Mobile&nbsp;is a mobile component library designed for financial
        scenarios，which is based on&nbsp;Vue.js. It has been actually applied
        to more than 10 products in the four major financial business segments
        of DiDi Chuxing.
      </p>
    </h3>
    <h4>Features</h4>
    <h3>
      <ul>
        <li>
          Rich Components40+ practical components can meet the basic needs of
          the mobile development, especially for financial scenarios.
        </li>
        <li>
          Unified visual specificationDesigned and maintained by designers of
          DiDi Finance Department to ensure a high-level visual consistency
          within and among projects.
        </li>
        <li>
          Strictly controlled Bundle volumeProvide on-demand loading
          capabilities and flexible use, avoid the import of useless code, and
          exporting&nbsp;es,&nbsp;umdformats and&nbsp;px,&nbsp;vh/vw&nbsp;two
          style units
        </li>
        <li>
          Flexible style themeUI style is configurable, flexible and easy to
          adapt to different design styles.
        </li>
        <li>Support TypeScript</li>
        <li>Support server-side rendering</li>
      </ul>
      <br />
    </h3>
    <p>
      <br />
    </p>
  </md-field>
</template>

<script>
import { Field } from 'mand-mobile'
export default {
  name: 'About',
  components: {
    [Field.name]: Field
  }
}
</script>