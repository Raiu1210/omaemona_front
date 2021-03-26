<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="1"
      >
        <v-sheet
          color="#f5f5f5"
          rounded="lg"
          min-height="2vh"
        >
        </v-sheet>
      </v-col>

      <v-col cols="12" sm="8">
        <v-sheet
          class="sheet"
          rounded="lg"
        >
          <v-row
            v-for="notification in notifications"
            :key="notification.id"
          >
          <v-col>
            <v-card
              class="mx-auto"
              color="#ffffff"
              :to="{path : '/article/' + notification.article_id}"
            >
              <v-card-subtitle class="pb-0 mb-0">
                {{covertUpdateTime(notification.createdAt)}}
              </v-card-subtitle>

              <v-card-title>
                {{notificationMessage(notification)}}
              </v-card-title>
            </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col style="justify-content: center;">
            <v-pagination
              v-model="page"
              :length="pageLength"
              :total-visible="7"
              @input = "gotoPageN"
            ></v-pagination>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>

      <v-col
        cols="12"
        sm="3"
      >
        <v-sheet
          color="#f5f5f5"
          rounded="lg"
          min-height="600px"
        >
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'

export default {
  data() {
    return {
      notifications: [],
      updated: '',
      page: 1,
      tabIndex: 0,
      destination: '',
      pageLength: 1,
    }
  },
  async beforeMount() {
    const address = await window.mpurse.getAddress()
    const res = await Api.get('getAllNotifications', {
      params: {
        address: address,
        page: this.$route.params.page == undefined ? 1 : this.$route.params.page
      }
    })
    const notificationsCount = res["data"]["notificationsCount"]

    this.notifications = res["data"]["notifications"]
    this.pageLength = Math.ceil(notificationsCount / 10)
  },
  methods: {
    covertUpdateTime(timeData) {
      const timeObj = new Date(timeData)
      return timeObj.getFullYear() + '年' + (Number(timeObj.getMonth()) + 1) + '月' + timeObj.getDate() + '日'
    },
    gotoPageN(page) {
      this.$router.push({ path: '/notification',
        query: {
          address: this.$route.query.address,
          page: page
        }
      })
    },
    notificationMessage(notificationObj) {
      if(notificationObj['type'] == 'comment') {
        return `あなたの記事に${notificationObj['from_address']}からコメントが付いたよ!`
      } else if(notificationObj['type'] == 'tip') {
        return `あなたの記事に${notificationObj['from_address']}から${notificationObj['sent_mona']}MONA投げ銭が来たよ！`
      }
    },
  },
  async watchQuery(newQuery, oldQuery) {
    const res = await Api.get('getAllNotifications', {
      params: {
        address: newQuery.address,
        page: newQuery.page == undefined ? 1 : newQuery.page
      }
    })
    this.page = Number(newQuery.page)
    this.notifications = res["data"]["notifications"]
    const notificationsCount = res["data"]["notificationsCount"]
    this.pageLength = Math.ceil(articlesCount / 10)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },
}
</script>


<style scoped>
.sheet {
  background:rgba(245,245,245,0);
}

</style>
