<template>
  <div class="homepage-container">
    <div class="banner">
      <img class="banner-img" src="https://inproductmarketing-static.canva.cn/featureBanners/20201008-Double11-desktop_x2.jpg" style="background-color: rgb(0, 0, 0);">
      <div class="banner-text">
        <h2 class="text-headline" style="color: rgb(255, 255, 255);">创建精彩设计</h2>
        <a class="text-link" href="https://www.canva.cn/search/templates?q=%E5%8F%8C%E5%8D%81%E4%B8%80%E6%B5%B7%E6%8A%A5" >
          <p>购物狂欢节，双十一海报合辑</p>
        </a>
      </div>
    </div>
    <a-row type="flex" justify="space-between" align="middle" class="poster-title">
      <h2>我的作品</h2>
      <router-link to="/mywork">查看我的所有作品</router-link>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in items2" :key="item" class="poster-item">
        <a-card hoverable>
          <template v-slot:cover>
            <img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" v-if="item % 2 === 0" />
            <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" v-else />
          </template>
          <a-card-meta title="未命名作品">
            <template v-slot:description>
              <div class="description-detail">
                <span>作者：是我本人啦</span>
                <span>浏览量：120</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red">
            HOT
          </a-tag>
          <a-tag color="green">
            NEW
          </a-tag>
        </div>
      </a-col>
    </a-row>
    <a-row class="poster-title" justify="space-between" align="middle">
      <h2>热门海报</h2>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="6" v-for="item in items" :key="item" class="poster-item">
        <a-card hoverable>
          <template v-slot:cover>
            <img src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" v-if="item % 2 === 0" />
            <img src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" v-else />
          </template>
          <a-card-meta title="未命名作品">
            <template v-slot:description>
              <div class="description-detail">
                <span>作者：是我本人啦</span>
                <span>浏览量：120</span>
              </div>
            </template>
          </a-card-meta>
        </a-card>
        <div class="tag-list">
          <a-tag color="red">
            HOT
          </a-tag>
          <a-tag color="green">
            NEW
          </a-tag>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-button type="primary" size="large">
        加载更多
      </a-button>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return { items: [0, 1, 2, 3, 4, 5], items2: [0, 1, 2, 3] }
  }
}
</script>

<style scoped>
.banner {
  display: flex;
  position: relative;
  height: 192px;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}
.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner-text {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.text-headline {
  text-shadow: 0 0 1px rgba(68,92,116,.02), 0 2px 8px rgba(57,76,96,.15);
  font-size: 3rem;
}
.text-link {
  color: #ffffff;
}
.text-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.poster-item {
  position: relative;
  margin-bottom: 20px;
}
.tag-list {
  position: absolute;
  top: -4px;
  left: 6px;
}
.ant-card-cover img {
  height: 300px;
  object-fit: cover;
}
.description-detail {
  display: flex;
  justify-content: space-between;
}
.poster-title {
  height: 70px;
}
.poster-title h2 {
  margin-bottom: 0px;
}
</style>
