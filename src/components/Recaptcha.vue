<template>
    <div id="g-recaptcha" class="g-recaptcha" :data-sitekey="captchaKey"></div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  data(){
      return {
          widgetId:0
      }
  },
  methods: {
    commit () {
      window.grecaptcha.execute(this.widgetId)
    },
    reset () {
      window.grecaptcha.reset(this.widgetId)
    },
    render () {
        if (window.grecaptcha) {
        this.widgetId = window.grecaptcha.render('g-recaptcha', {
          sitekey: this.captchaKey,
          callback: (response) => {
            this.$emit('verify', this.widgetId)
          }
        });
      }
    }
  },
  computed:{
      ...mapGetters(['captchaKey'])
  },
  mounted () {
    this.render()
  }
}
</script>
<style>
</style>
