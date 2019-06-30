<template>
  <el-card>
    <Mybread one="数据统计" two="数据报表"></Mybread>
    <div class="echart-box" id="E_zkcl" style="width: 1000px;
       height:600px"></div>
  </el-card>
</template>

<script>
import Mybread from '../mylayout/mybread'
export default {
  data () {
    return {}
  },
  methods: {
    drawLine () {
      let myChart1 = this.$echarts.init(document.getElementById('E_zkcl'))
      this.$http({
        url: 'reports/type/1'
      }).then(res => {
        let optionData = res.data.data
        optionData.xAxis[0].boundaryGap = false
        myChart1.setOption(optionData)
      })

      // 根据窗口的大小变动图表 --- 重点
      window.onresize = function () {
        // myChart.resize();
        myChart1.resize() // 若有多个图表变动，可多写
      }
    }
  },
  mounted () {
    this.drawLine()
  },
  components: {
    Mybread: Mybread
  }
}
</script>
<style>
</style>
