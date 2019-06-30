<template>
  <div id="container"></div>
</template>

<script>
import BMap from "BMap";
export default {
  mounted() {
    // 创建实例
    var map = new BMap.Map("container");
    // 设置中心点
    var point = new BMap.Point(114.06667, 22.61667);
    // 展示级别
    map.centerAndZoom(point, 12);
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
  }
};
</script>

<style>
#container {
  height: 100%;
}
</style>
