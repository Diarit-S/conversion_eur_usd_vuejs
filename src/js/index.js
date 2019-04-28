import Vue from 'vue';
import _ from 'lodash';
import VueResource from 'vue-resource';
// import { watch } from 'fs';
Vue.use(VueResource);

new Vue({
  el: '#app',
  data: {
    euros: '',
    taux: '',
    conversion: ''
  },
  methods: {
    getConversion: _.debounce(
      function () {
        if (!this.euros) {
          this.conversion = "Rentrez un nombre";
          return;
        }else if (this.euros.search(/^[0-9]+$/) === -1) {
          this.conversion = "Ne tapez que des chiffres";
          return;
        }
        this.$http.get('https://api.exchangeratesapi.io/latest')
        .then(function(response){
          this.taux = response.body.rates.USD;
          this.conversion = `${(this.taux * this.euros.replace(',', '.')).toFixed(2)} $`;
        })
        .catch(function(error) {
          this.conversion = "Erreur ! Impossible d'acceder à l'API." + error
        })
      }, 
      500
    )
    
  },
  watch: {
    euros(){
      this.conversion = "J'attend que vous arretiez de taper..."
      this.getConversion()
    }
  }
});