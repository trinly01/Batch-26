<template>
  <div>
    <q-toolbar class="bg-primary text-white">
      <q-btn flat round dense icon="menu" class="q-mr-sm" />
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
      </q-avatar>

      <q-toolbar-title>{{user}}  Batch 26 Todo App
        <greet name="Pogi" />
      </q-toolbar-title>

      <q-btn @click="register" flat round dense icon="person_add" />
      <q-btn v-if="user" @click="logout" flat dense :label="`${user.name} | Logout`" />
      <q-btn v-else @click="login" flat dense label="Login" />

      <q-btn @click="downloadPDF" flat round dense icon="picture_as_pdf" />
    </q-toolbar>
    <div class="row q-pa-md">
      <q-input @keyup.enter="todo ? add : () => {}" class="col" v-model="todo" label="Task Description" />
      <q-btn :disabled="!todo" icon="save" round @click="add"></q-btn>
    </div>
    <!-- <ul>
      <li v-for="(t, i) in tasks" :key="i">
        {{ i + 1 }} {{ t.desc }}
        <q-btn @click="remove(i)" size="sm" flat round dense color="red" icon="delete" />
      </li>
    </ul> -->
    <q-list bordered separator v-for="(t, i) in tasks" :key="i + t._id">
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <!-- <q-icon name="signal_wifi_off" /> -->
          <q-checkbox :value="t.isDone" @click.native="tasksSrvc.patch(t._id, {isDone: !t.isDone})" />
        </q-item-section>
        <q-item-section>
          {{t.desc}}
          <q-popup-edit v-model="t.desc" title="Edit" @save="(val) => tasksSrvc.patch(t._id, {desc: val})" >
            <q-input v-model="t.desc" dense autofocus counter />
          </q-popup-edit>
        </q-item-section>
        <q-item-section side>
          <q-btn @click="remove(t._id)" round dense color="red" icon="delete" />
        </q-item-section>
      </q-item>
    </q-list>
    <pie-chart :donut="true" :data="[['Done', allDone], ['Strawberry', allPending]]"></pie-chart>
  </div>
</template>

<script>
import greet from 'components/greet'

export default {
  components: {
    greet
  },
  destroy () {
    this.tasksSrvc.destroy()
    this.$dbCon.removeAllListeners(['login', 'logout'])
  },
  mounted () {
    this.$dbCon.authenticate()
    this.tasksSrvc = this.$dbCon.wingsService('todos').init()
    this.usersSrvc = this.$dbCon.wingsService('users')
    this.tasksSrvc.on('dataChange', (messages) => {
      console.log(messages)
      this.tasks = messages
    })

    this.$dbCon.on('login', result => {
      console.log(result)
      this.user = result.user
      this.tasksSrvc.reset()
    })

    this.$dbCon.on('logout', () => {
      this.user = false
    })
  },
  data: function () {
    return {
      user: null,
      todo: '',
      tasks: [],
      tasksSrvc: null,
      usersSrvc: null
    }
  },
  methods: {
    async register () {
      await this.usersSrvc.create({
        email: 'asd@asd.asd',
        password: 'asd'
      })
    },
    async login () {
      await this.$dbCon.authenticate({
        email: 'asd@asd.asd',
        password: 'asd',
        strategy: 'local'
      })
    },
    logout () {
      this.$dbCon.logout()
    },
    downloadPDF () {
      let dd = {
        content: [
          {
            // style: 'tableExample',
            table: {
              body: [
                ['task', 'status'],
                ...this.tasks.map(t => ([t.desc, t.isDone]))
              ]
            }
          }
        ]
      }
      this.$pdfMake.createPdf(dd).print()
    },
    add () {
      // this.tasks.push({
      //   desc: this.todo,
      //   isDone: false
      // })

      this.tasksSrvc.create({
        desc: this.todo,
        isDone: false
      })
      this.todo = ''
    },
    remove (i) {
      // this.tasks.splice(i, 1)
      this.tasksSrvc.remove(i)
    }
  },
  computed: {
    allDone () {
      return this.tasks.filter(function (todo) {
        return todo.isDone
      }).length
    },
    allPending () {
      return this.tasks.filter(t => !t.isDone).length
    }
  }
}
</script>
