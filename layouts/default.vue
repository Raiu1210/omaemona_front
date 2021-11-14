<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-container>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title grey--text text--darken-2">
              機能一覧
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list>
          <v-list-item
            @click.stop="drawer = !drawer"
            v-for="(item, i) in items"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      color="primary"
      app
    >
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />

      <nuxt-link to="/">
        <v-toolbar-title class="white--text" v-text="title" />
      </nuxt-link>

      <div class="search">
        <input
          type="text"
          class="search_form"
          placeholder="記事を検索"
          v-model="searchQuery"
          @keydown.enter="search"
        >
      </div>

      <v-spacer />

      <!-- @todo : 公開鍵からユーザを特定して表示したい -->
      <NuxtLink to="/notification"  v-if="this.$store.state.verified">
        <v-badge
          overlap
          class="mr-4"
          color="red"
          :content="notificationCount"
          :value="notificationCount"
          @click.native="checkedNotification"
        >
          <v-icon dark>
            mdi-bell
          </v-icon>
        </v-badge>
      </NuxtLink>
      <NuxtLink to="/mypage" v-if="this.$store.state.verified">
        <v-avatar color="">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </NuxtLink>
      <v-btn
        depressed
        v-if="!this.$store.state.verified"
        @click="login"
      >
        ログイン
      </v-btn>

    </v-app-bar>
    <v-main>
      <v-container fluid class="pa-0 mb-12">
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      absolute
      inset
      color="#3e3e3e"
      class="white--text mt-5 footer"
      app
    >
      <v-row>
        <v-col cols="6">
          <div class="ma-10">
            <h1>モナレッジ</h1>
            <p class="mt-3">開発・運営 : 変態物理(らいう)</p>
            <v-row>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="blue"
                href="https://twitter.com/Mr_1484"
              >
                <v-icon dark>
                  mdi-twitter
                </v-icon>
              </v-btn>
              <v-btn
                class="mx-2"
                fab
                dark
                small
                color="black"
                href="https://github.com/Raiu1210"
              >
                <v-icon dark>
                  mdi-github
                </v-icon>
              </v-btn>
            </v-row>
          </div>
        </v-col>

        <v-spacer></v-spacer>
        <!-- links -->
        <v-col cols="6">
          <div class="ma-10">
            <NuxtLink class="links" to="/terms"><p class="mt-3 ml-8">利用規約</p></NuxtLink>
          </div>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>


<script>
import {axiosInstance as Api} from '~/myModules/api'
import checkMyAddress from '~/myModules/checkMyAddress'

export default {
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'ホーム',
          to: '/'
        },
        {
          icon: 'mdi-pencil-plus',
          title: '記事を書く',
          to: '/write'
        },
        {
          icon: 'mdi-account-plus',
          title: 'サインアップ',
          to: '/signup'
        },
        {
          icon: 'mdi-slot-machine',
          title: 'もじガチャ',
          to: '/moji-gacha'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'モナレッジ',
      searchQuery: '',
      notificationCount: 0
    }
  },
  mounted() {
    const EventEmitter=function(){function EventEmitter(){this._events=this._events||{};this._maxListeners=this._maxListeners||undefined}EventEmitter.EventEmitter=EventEmitter;EventEmitter.prototype._events=undefined;EventEmitter.prototype._maxListeners=undefined;EventEmitter.defaultMaxListeners=10;EventEmitter.prototype.setMaxListeners=function(n){if(!isNumber(n)||n<0||isNaN(n))throw TypeError("n must be a positive number");this._maxListeners=n;return this};EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(!this._events)this._events={};if(type==="error"){if(!this._events.error||isObject(this._events.error)&&!this._events.error.length){er=arguments[1];if(er instanceof Error){throw er}else{var err=new Error('Uncaught, unspecified "error" event. ('+er+")");err.context=er;throw err}}}handler=this._events[type];if(isUndefined(handler))return false;if(isFunction(handler)){switch(arguments.length){case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;default:args=Array.prototype.slice.call(arguments,1);handler.apply(this,args)}}else if(isObject(handler)){args=Array.prototype.slice.call(arguments,1);listeners=handler.slice();len=listeners.length;for(i=0;i<len;i++)listeners[i].apply(this,args)}return true};EventEmitter.prototype.addListener=function(type,listener){var m;if(!isFunction(listener))throw TypeError("listener must be a function");if(!this._events)this._events={};if(this._events.newListener)this.emit("newListener",type,isFunction(listener.listener)?listener.listener:listener);if(!this._events[type])this._events[type]=listener;else if(isObject(this._events[type]))this._events[type].push(listener);else this._events[type]=[this._events[type],listener];if(isObject(this._events[type])&&!this._events[type].warned){if(!isUndefined(this._maxListeners)){m=this._maxListeners}else{m=EventEmitter.defaultMaxListeners}if(m&&m>0&&this._events[type].length>m){this._events[type].warned=true;console.error("(node) warning: possible EventEmitter memory "+"leak detected. %d listeners added. "+"Use emitter.setMaxListeners() to increase limit.",this._events[type].length);if(typeof console.trace==="function"){console.trace()}}}return this};EventEmitter.prototype.on=EventEmitter.prototype.addListener;EventEmitter.prototype.once=function(type,listener){if(!isFunction(listener))throw TypeError("listener must be a function");var fired=false;function g(){this.removeListener(type,g);if(!fired){fired=true;listener.apply(this,arguments)}}g.listener=listener;this.on(type,g);return this};EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!isFunction(listener))throw TypeError("listener must be a function");if(!this._events||!this._events[type])return this;list=this._events[type];length=list.length;position=-1;if(list===listener||isFunction(list.listener)&&list.listener===listener){delete this._events[type];if(this._events.removeListener)this.emit("removeListener",type,listener)}else if(isObject(list)){for(i=length;i-- >0;){if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break}}if(position<0)return this;if(list.length===1){list.length=0;delete this._events[type]}else{list.splice(position,1)}if(this._events.removeListener)this.emit("removeListener",type,listener)}return this};EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;if(!this._events.removeListener){if(arguments.length===0)this._events={};else if(this._events[type])delete this._events[type];return this}if(arguments.length===0){for(key in this._events){if(key==="removeListener")continue;this.removeAllListeners(key)}this.removeAllListeners("removeListener");this._events={};return this}listeners=this._events[type];if(isFunction(listeners)){this.removeListener(type,listeners)}else if(listeners){while(listeners.length)this.removeListener(type,listeners[listeners.length-1])}delete this._events[type];return this};EventEmitter.prototype.listeners=function(type){var ret;if(!this._events||!this._events[type])ret=[];else if(isFunction(this._events[type]))ret=[this._events[type]];else ret=this._events[type].slice();return ret};EventEmitter.prototype.listenerCount=function(type){if(this._events){var evlistener=this._events[type];if(isFunction(evlistener))return 1;else if(evlistener)return evlistener.length}return 0};EventEmitter.listenerCount=function(emitter,type){return emitter.listenerCount(type)};function isFunction(arg){return typeof arg==="function"}function isNumber(arg){return typeof arg==="number"}function isObject(arg){return typeof arg==="object"&&arg!==null}function isUndefined(arg){return arg===void 0}return EventEmitter}();
    const ORIGIN = 'https://monapalette.komikikaku.com';
    const SUPPORTED_METHODS = ['getAddress', 'sendAsset', 'signRawTransaction', 'signMessage', 'sendRawTransaction', 'counterBlock', 'counterParty'];
    const monapaletteConnect = {};
    const id2messageListener = {};
    const sendMethod = async(method, params) => {
        if (!window.parent) throw new Error('AppConnect not found');
        const id = Math.random().toFixed(10).slice(-10);
        return await new Promise((resolve, reject) => {
            id2messageListener[id] = (event) => {
                try {
                    if (event.origin !== ORIGIN) return;
                    const data = event.data;
                    if (data.id !== id) return;
                    delete id2messageListener[id];
                    if (data.error) reject(data.error);
                    else resolve(data.value);
                }
                catch (error) { reject(error) }
            };
            window.parent.postMessage({ id, method, params }, ORIGIN);
        });
    };
    for (const method of SUPPORTED_METHODS) monapaletteConnect[method] = (...params) => sendMethod(method, params);
    monapaletteConnect.updateEmitter = new EventEmitter();
    window.monapaletteConnect = monapaletteConnect;
    window.addEventListener('message', (event) => {
        for (const id in id2messageListener) id2messageListener[id](event);
    });
  },
  methods: {
    search() {
      this.$router.push({
        path: '/search',
        query: {
          q: this.searchQuery
        }
      })
    },
    async login() {
      if(!window.mpurse) {
        this.$router.push('/signup')
      }

      const checkResult = await checkMyAddress()
      if(checkResult['status']) {
        this.$store.commit('setVerified', checkResult['userInfo']['address'])
        const address = await window.mpurse.getAddress()
        const res = await Api.get('getNotificationsCount', {
          params: {
            address: address
          }
        })
        this.notificationCount = res['data']['notificationsCount']
      } else {
        this.$router.push('/signup')
      }
    },
    checkedNotification() {
      this.notificationCount = 0
    }
  }
}
</script>


<style scoped>
.v-application {
  background-color: #f5f5f5;
}

.links {
  text-decoration: none;
  color: #f5f5f5;
}

.footer {
  z-index: 2;
}

@media (max-width: 600px) {
  .search {
    width: 100px;
    margin:0 auto;
    background-color: white;
    border-radius:15px;
    -moz-border-radius:15px;
    -webkit-border-radius:15px;
    padding:6px 5px 6px 10px;
    margin-left: 10px;
  }

  .search_form {
    width: 100px;
    outline: none;
  }
}
@media (min-width: 600px) {
  .search {
    width: 400px;
    height: 38px;
    margin:0 auto;
    background-color: white;
    border-radius:10px;
    -moz-border-radius:10px;
    -webkit-border-radius:10px;
    padding:6px 5px 6px 20px;
    margin-left: 10px;
  }

  .search_form {
    width: 400px;
    outline: none;
  }
}


</style>
