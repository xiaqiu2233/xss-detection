<template>
  <div class="search-div">
    <Input v-model="url" placeholder="请输入要检测的URL">
      <Button slot="append" icon="search" @click="handleUrl"></Button>
    </Input>
  </div>
</template>

<script>
// import axios from 'renderer/utils/http'
import Crawler from 'crawler'
export default {
  data: function () {
    return {
      url: ''
    }
  },
  methods: {
    handleUrl () {
      var c = new Crawler({
        // 在每个请求处理完毕后将调用此回调函数
        callback: function (error, res, done) {
          if (error) {
            console.log(error)
          } else {
            console.log(res)
            var $ = res.$
            // $ 默认为 Cheerio 解析器
            // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
            console.log($('title').text())
          }
          done()
        }
      })
      c.queue(this.url)
    }
  }
}
</script>

<style>
  .search-div{
    width: 50%;
    margin: 40px auto;
  }
</style>
